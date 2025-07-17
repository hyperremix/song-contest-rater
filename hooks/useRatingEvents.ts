'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import { getQueryClient } from '@/app/get-query-client';
import { Act } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/act_pb';
import { Rating } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/rating_pb';
import { RatingService } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/rating_service_pb';
import { useAuth } from '@clerk/nextjs';
import { createClient } from '@connectrpc/connect';
import { ConnectQueryKey } from '@connectrpc/connect-query';
import { useEffect, useRef } from 'react';
import {
  removeRating,
  sortedRatingAdd,
  sortedRatingUpdate,
} from '../utils/rating/state';

const ratingEventReducers: Record<
  string,
  (ratings: Rating[], rating: Rating) => Rating[]
> = {
  EVENT_TYPE_CREATED: sortedRatingAdd,
  EVENT_TYPE_UPDATED: sortedRatingUpdate,
  EVENT_TYPE_DELETED: removeRating,
};

/**
 * Custom hook to handle rating events using ConnectRPC streaming
 * @param queryKey The queryKey of the act to listen for rating events
 */
export const useRatingEvents = (queryKey: ConnectQueryKey) => {
  const queryClient = getQueryClient();
  const { getToken } = useAuth();
  const abortRef = useRef<{ cancel: () => void } | null>(null);

  useEffect(() => {
    if (!queryKey) return;
    let cancelled = false;
    let controller = {
      cancel: () => {
        cancelled = true;
      },
    };
    abortRef.current = controller;

    const startStream = async () => {
      const transport = getBrowserTransport(getToken);
      const client = createClient(RatingService, transport);
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries && !cancelled) {
        try {
          for await (const res of client.streamRatings({})) {
            if (cancelled) break;
            const rating = res.rating;
            if (!rating) continue;

            queryClient.setQueryData(queryKey, (old: Act) => {
              if (!old) return old;
              return {
                ...old,
                ratings: ratingEventReducers[res.eventType](
                  old.ratings,
                  rating,
                ),
              };
            });
          }
        } catch (err) {
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount),
            );
          }
        }
      }
    };

    startStream();

    return () => {
      cancelled = true;
      abortRef.current = null;
    };
  }, [queryKey, queryClient, getToken]);
};
