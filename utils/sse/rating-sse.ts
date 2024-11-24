import { Platform } from 'react-native';
import EventSource, { EventSourceListener } from 'react-native-sse';
import { environment } from '../../environment';
import { RatingResponse } from '../../protos/rating';
import { useUserStore } from '../../store';
import { useRatingStore } from '../../store/rating';
import { removeRating, sortedRatingAdd, sortedRatingUpdate } from '../rating';

type SCREvent = 'createRating' | 'updateRating' | 'deleteRating' | 'ping';

let currentEventSource: EventSource<SCREvent> | null = null;

useUserStore.subscribe((state) => {
  if (!state.authData) {
    return;
  }

  currentEventSource?.close();

  currentEventSource = new EventSource<SCREvent>(
    `${Platform.OS === 'web' && environment.stage === 'local' ? 'http://localhost:8080' : environment.backendUrl}/ratings/events`,
    {
      headers: {
        Authorization: {
          toString: () =>
            'Bearer ' + useUserStore.getState().authData?.accessToken,
        },
      },
    },
  );

  const listener: EventSourceListener<SCREvent> = (event) => {
    if (event.type === 'error') {
      console.error('Connection error:', event.message);
      return;
    }

    if (event.type === 'exception') {
      console.error('Error:', event.message, event.error);
      return;
    }

    if (
      event.type === 'open' ||
      event.type === 'ping' ||
      event.type === 'close' ||
      event.type === 'timeout' ||
      event.type === 'message'
    ) {
      return;
    }

    if (!event.data) {
      console.error('Received empty event.');
      return;
    }

    const rating = JSON.parse(event.data) as RatingResponse;

    switch (event.type) {
      case 'createRating':
        useRatingStore.setState({
          ratings: sortedRatingAdd(useRatingStore.getState().ratings, rating),
        });
        break;
      case 'updateRating':
        useRatingStore.setState({
          ratings: sortedRatingUpdate(
            useRatingStore.getState().ratings,
            rating,
          ),
        });
        break;
      case 'deleteRating':
        useRatingStore.setState({
          ratings: removeRating(useRatingStore.getState().ratings, rating.id),
        });
        break;
    }
  };

  currentEventSource.addEventListener('open', listener);
  currentEventSource.addEventListener('ping', listener);
  currentEventSource.addEventListener('error', listener);
  currentEventSource.addEventListener('close', listener);
  currentEventSource.addEventListener('message', listener);
  currentEventSource.addEventListener('createRating', listener);
  currentEventSource.addEventListener('updateRating', listener);
  currentEventSource.addEventListener('deleteRating', listener);
});
