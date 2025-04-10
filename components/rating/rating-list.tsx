'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import { getQueryClient } from '@/app/get-query-client';
import { useRatingEvents } from '@/hooks/useRatingEvents';
import { toRating } from '@/utils/rating/toRatingResponse';
import { GetActResponse } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/act_pb';
import {
  CreateRatingRequestSchema,
  Rating,
  UpdateRatingRequestSchema,
} from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/rating_pb';
import { getAct } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/act_service-ActService_connectquery';
import {
  createRating,
  updateRating,
} from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/rating_service-RatingService_connectquery';
import { create } from '@bufbuild/protobuf';
import { useUser } from '@clerk/nextjs';
import {
  createConnectQueryKey,
  useMutation,
  useSuspenseQuery,
} from '@connectrpc/connect-query';
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
  const transport = getBrowserTransport();

  const getActQueryKey = createConnectQueryKey({
    schema: getAct,
    transport,
    input: { id: actId },
    cardinality: 'finite',
  });

  const {
    data: { act },
  } = useSuspenseQuery(getAct, { id: actId }, { transport });

  useRatingEvents(actId);

  const createMutation = useMutation(createRating, {
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: getActQueryKey }),
  });

  const updateMutation = useMutation(updateRating, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: getActQueryKey });
      const previousAct =
        queryClient.getQueryData<GetActResponse>(getActQueryKey);

      queryClient.setQueryData(getActQueryKey, (old: GetActResponse) => ({
        ...old,
        act: {
          ...old.act,
          ratings: old.act?.ratings.map((rating) =>
            rating.id === variables.id
              ? toRating(create(UpdateRatingRequestSchema, variables), {
                  id: (user?.publicMetadata.id as string) ?? '',
                  email: user?.primaryEmailAddress?.emailAddress ?? '',
                  image_url: user?.imageUrl ?? '',
                  firstname: user?.firstName ?? '',
                  lastname: user?.lastName ?? '',
                })
              : rating,
          ),
        },
      }));

      return { previousAct };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(getActQueryKey, context?.previousAct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getActQueryKey });
    },
  });

  const [isCreateRatingDialogOpen, setIsCreateRatingDialogOpen] =
    useState(false);
  const [isEditRatingDialogOpen, setIsEditRatingDialogOpen] = useState(false);

  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
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
            rating={toRating(
              create(CreateRatingRequestSchema, createMutation.variables),
              {
                id: (user?.publicMetadata.id as string) ?? '',
                email: user?.primaryEmailAddress?.emailAddress ?? '',
                image_url: user?.imageUrl ?? '',
                firstname: user?.firstName ?? '',
                lastname: user?.lastName ?? '',
              },
            )}
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
          error={createMutation.error as unknown}
        />
      )}
      {updateMutation.isError && (
        <HttpErrorDialog
          isOpen={updateMutation.isError}
          onOpenChange={setIsEditRatingDialogOpen}
          error={updateMutation.error as unknown}
        />
      )}
    </div>
  );
};
