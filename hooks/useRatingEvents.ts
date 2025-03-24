'use client';

import { getQueryClient } from '@/app/get-query-client';
import { enviroment } from '@/environment';
import { ActResponse } from '@/protos/act';
import { RatingResponse } from '@/protos/rating';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import {
  removeRating,
  sortedRatingAdd,
  sortedRatingUpdate,
} from '../utils/rating/state';

export type RatingEventType =
  | 'createRating'
  | 'updateRating'
  | 'deleteRating'
  | 'ping'
  | 'error'
  | 'exception';

export interface RatingEvent {
  id?: string;
  event: RatingEventType;
  data?: RatingResponse;
  retry?: number;
}

/**
 * Updates the query cache when a new rating is created
 */
const handleCreateRating = (
  queryClient: ReturnType<typeof getQueryClient>,
  actId: string,
  rating?: RatingResponse,
) => {
  if (rating?.act_id !== actId) return;

  queryClient.setQueryData(
    ['getAct', actId],
    (old: ActResponse | undefined) => {
      if (!old) return old;

      // Check if this rating already exists in our list
      const ratingExists = old.ratings.some((r) => r.id === rating.id);
      if (ratingExists) return old;

      // Add the new rating to the list
      return {
        ...old,
        ratings: sortedRatingAdd(old.ratings, rating),
      };
    },
  );
};

/**
 * Updates the query cache when a rating is updated
 */
const handleUpdateRating = (
  queryClient: ReturnType<typeof getQueryClient>,
  actId: string,
  rating?: RatingResponse,
) => {
  if (rating?.act_id !== actId) return;

  queryClient.setQueryData(
    ['getAct', actId],
    (old: ActResponse | undefined) => {
      if (!old) return old;

      // Replace the updated rating
      return {
        ...old,
        ratings: sortedRatingUpdate(old.ratings, rating),
      };
    },
  );
};

/**
 * Updates the query cache when a rating is deleted
 */
const handleDeleteRating = (
  queryClient: ReturnType<typeof getQueryClient>,
  actId: string,
  rating?: RatingResponse,
) => {
  if (rating?.act_id !== actId) return;

  queryClient.setQueryData(
    ['getAct', actId],
    (old: ActResponse | undefined) => {
      if (!old) return old;

      // Remove the deleted rating
      return {
        ...old,
        ratings: removeRating(old.ratings, rating.id),
      };
    },
  );
};

/**
 * Processes a single SSE event and updates the cache accordingly
 */
const processEvent = (
  queryClient: ReturnType<typeof getQueryClient>,
  actId: string,
  ratingEvent: RatingEvent,
) => {
  // Handle different event types based on the 'event' field from the backend
  switch (ratingEvent.event) {
    case 'createRating':
      handleCreateRating(queryClient, actId, ratingEvent.data);
      break;

    case 'updateRating':
      handleUpdateRating(queryClient, actId, ratingEvent.data);
      break;

    case 'deleteRating':
      handleDeleteRating(queryClient, actId, ratingEvent.data);
      break;

    case 'error':
    case 'exception':
      console.error('SSE Error:', ratingEvent.data);
      break;

    case 'ping':
      if (process.env.NODE_ENV === 'development') {
        console.log('Ping received from server');
      }
      break;

    default:
      console.log('Unknown event:', ratingEvent);
      break;
  }
};

/**
 * Parses SSE event data from text format according to the backend format
 */
const parseEventData = (eventText: string): RatingEvent | null => {
  if (!eventText.trim()) return null;

  const lines = eventText.split('\n');

  // Extract event fields
  const eventType = lines
    .find((line) => line.startsWith('event:'))
    ?.substring(6)
    .trim();

  const eventId = lines
    .find((line) => line.startsWith('id:'))
    ?.substring(3)
    .trim();

  const retryStr = lines
    .find((line) => line.startsWith('retry:'))
    ?.substring(6)
    .trim();

  const dataLine = lines
    .find((line) => line.startsWith('data:'))
    ?.substring(5)
    .trim();

  if (!eventType) return null;

  try {
    // Create the event object
    const event: RatingEvent = {
      event: eventType as RatingEventType,
      id: eventId,
    };

    // Add retry if present
    if (retryStr) {
      event.retry = parseInt(retryStr, 10);
    }

    // Parse data if present
    if (dataLine) {
      event.data = JSON.parse(dataLine);
    }

    return event;
  } catch (error) {
    console.error('Error parsing event data:', error);
    return null;
  }
};

/**
 * Processes a stream of SSE events
 */
const processEventStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  decoder: TextDecoder,
  queryClient: ReturnType<typeof getQueryClient>,
  actId: string,
  abortController: AbortController,
  reconnect: () => void,
) => {
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('Stream complete');
        break;
      }

      // Decode the chunk and add it to our buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete events in the buffer
      const events = buffer.split('\n\n');
      buffer = events.pop() || ''; // Keep the last incomplete event in the buffer

      for (const event of events) {
        const ratingEvent = parseEventData(event);
        if (ratingEvent) {
          processEvent(queryClient, actId, ratingEvent);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Error reading stream:', error);
      scheduleReconnect(abortController, reconnect);
    }
  }
};

/**
 * Schedules a reconnection attempt after a delay
 * Uses the retry value from the server if available
 */
const scheduleReconnect = (
  abortController: AbortController,
  reconnect: () => void,
  delay = 10000,
) => {
  setTimeout(() => {
    if (!abortController.signal.aborted) {
      reconnect();
    }
  }, delay);
};

/**
 * Establishes an SSE connection using fetch API
 */
const establishEventStream = async (
  token: string | null,
  abortController: AbortController,
  queryClient: ReturnType<typeof getQueryClient>,
  actId: string,
  reconnect: () => void,
) => {
  try {
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(
      `${enviroment.public.backendUrl}/ratings/events`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
        signal: abortController.signal,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Get a reader from the response body stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Process the stream
    await processEventStream(
      reader,
      decoder,
      queryClient,
      actId,
      abortController,
      reconnect,
    );
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Error setting up event stream:', error);
      scheduleReconnect(abortController, reconnect);
    }
  }
};

/**
 * Custom hook to handle SSE events for ratings using Fetch API
 * @param actId The ID of the act to listen for rating events
 */
export const useRatingEvents = (actId: string) => {
  const queryClient = getQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    if (
      actId === null ||
      actId === undefined ||
      actId === '' ||
      actId === 'not-set'
    ) {
      return;
    }

    // Create a new AbortController for this effect
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Function to start the SSE connection
    const startEventStream = async () => {
      const token = await getToken();
      await establishEventStream(
        token,
        abortController,
        queryClient,
        actId,
        startEventStream,
      );
    };

    // Start the event stream
    startEventStream();

    // Clean up function
    return () => {
      // Abort any ongoing fetch requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [actId, queryClient, getToken]);
};
