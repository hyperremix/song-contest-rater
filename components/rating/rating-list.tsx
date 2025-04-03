'use client';

import { getQueryClient } from '@/app/get-query-client';
import { useRatingEvents } from '@/hooks/useRatingEvents';
import { HttpError } from '@/utils/http';
import { getAct } from '@/utils/http/act';
import { createRating, updateRating } from '@/utils/http/rating';
import { toRatingResponse } from '@/utils/rating/toRatingResponse';
import { useUser } from '@clerk/nextjs';
import { ActResponse } from '@hyperremix/song-contest-rater-protos/act';
import {
  CreateRatingRequest,
  RatingResponse,
  UpdateRatingRequest,
} from '@hyperremix/song-contest-rater-protos/rating';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { HttpErrorDialog } from '../dialog/http-error-dialog';
import { Button } from '../ui/button';
import { CreateRatingDialog } from './create-rating-dialog';
import { RatingCard } from './rating-card';
import { UpdateRatingDialog } from './update-rating-dialog';

type Props = {
  contestId: string;
  actId: string;
};

export const RatingList = ({ contestId, actId }: Props) => {
  const { user } = useUser();
  const queryClient = getQueryClient();

  const { data: act } = useSuspenseQuery({
    queryKey: ['getAct', actId],
    queryFn: () => getAct(actId),
  });

  useRatingEvents(actId);

  const createMutation = useMutation({
    mutationFn: (createRatingRequest: CreateRatingRequest) =>
      createRating(createRatingRequest),
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: ['getAct', actId] }),
  });

  const updateMutation = useMutation({
    mutationFn: (updateRatingRequest: UpdateRatingRequest) =>
      updateRating(updateRatingRequest),
    onMutate: async (updateRatingRequest: UpdateRatingRequest) => {
      await queryClient.cancelQueries({ queryKey: ['getAct', actId] });
      const previousAct = queryClient.getQueryData<ActResponse>([
        'getAct',
        actId,
      ]);

      queryClient.setQueryData(['getAct', actId], (old: ActResponse) => ({
        ...old,
        ratings: old.ratings.map((rating) =>
          rating.id === updateRatingRequest.id
            ? toRatingResponse(updateRatingRequest, {
                id: (user?.publicMetadata.id as string) ?? '',
                email: user?.primaryEmailAddress?.emailAddress ?? '',
                image_url: user?.imageUrl ?? '',
                firstname: user?.firstName ?? '',
                lastname: user?.lastName ?? '',
              })
            : rating,
        ),
      }));

      return { previousAct };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['getAct', actId], context?.previousAct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAct', actId] });
    },
  });

  const [isCreateRatingDialogOpen, setIsCreateRatingDialogOpen] =
    useState(false);
  const [isEditRatingDialogOpen, setIsEditRatingDialogOpen] = useState(false);

  const [selectedRating, setSelectedRating] = useState<RatingResponse | null>(
    null,
  );
  const canCreateRating = useMemo(
    () =>
      !act?.ratings.some(
        (rating) => rating.user?.id === user?.publicMetadata.id,
      ),
    [act?.ratings, user?.publicMetadata.id],
  );

  return (
    <div>
      <div className="flex flex-col gap-2">
        {act?.ratings?.map((rating) => (
          <RatingCard
            key={rating.id}
            rating={rating}
            isEditable={user?.publicMetadata.id === rating.user?.id}
            onClick={() => {
              setIsEditRatingDialogOpen(true);
              setSelectedRating(rating);
            }}
          />
        ))}
        {createMutation.isPending && (
          <RatingCard
            rating={toRatingResponse(createMutation.variables, {
              id: (user?.publicMetadata.id as string) ?? '',
              email: user?.primaryEmailAddress?.emailAddress ?? '',
              image_url: user?.imageUrl ?? '',
              firstname: user?.firstName ?? '',
              lastname: user?.lastName ?? '',
            })}
            isEditable={false}
          />
        )}
      </div>
      {canCreateRating && (
        <div className="fixed bottom-8 mx-auto flex w-full max-w-3xl justify-end pr-10">
          <Button
            size="icon"
            className="rounded-full [&_svg]:size-6"
            onClick={() => setIsCreateRatingDialogOpen(true)}
          >
            <Plus />
          </Button>
        </div>
      )}
      {isCreateRatingDialogOpen && (
        <CreateRatingDialog
          isOpen={isCreateRatingDialogOpen}
          onOpenChange={setIsCreateRatingDialogOpen}
          onSave={createMutation.mutate}
          contestId={contestId}
          actId={actId}
        />
      )}
      {isEditRatingDialogOpen && (
        <UpdateRatingDialog
          isOpen={isEditRatingDialogOpen}
          onOpenChange={setIsEditRatingDialogOpen}
          onSave={updateMutation.mutate}
          rating={selectedRating}
        />
      )}
      {createMutation.isError && (
        <HttpErrorDialog
          isOpen={createMutation.isError}
          onOpenChange={setIsCreateRatingDialogOpen}
          error={createMutation.error as unknown as HttpError}
        />
      )}
      {updateMutation.isError && (
        <HttpErrorDialog
          isOpen={updateMutation.isError}
          onOpenChange={setIsEditRatingDialogOpen}
          error={updateMutation.error as unknown as HttpError}
        />
      )}
    </div>
  );
};
