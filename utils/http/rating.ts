'use server';

import {
  CreateRatingRequest,
  RatingResponse,
  UpdateRatingRequest,
} from '@hyperremix/song-contest-rater-protos/rating';
import { callApi, httpClient } from '.';

export const createRating = async (rating: CreateRatingRequest) =>
  await callApi(() => httpClient.post<RatingResponse>('/ratings', rating));

export const updateRating = async (rating: UpdateRatingRequest) =>
  await callApi(() =>
    httpClient.put<RatingResponse>(`/ratings/${rating.id}`, rating),
  );
