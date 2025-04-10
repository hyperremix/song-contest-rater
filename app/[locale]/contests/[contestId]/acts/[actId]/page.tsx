import { getQueryClient } from '@/app/get-query-client';
import { getServerTransport } from '@/app/get-server-transport';
import { ActHeader } from '@/components/act/act-header';
import { AppBar } from '@/components/custom/app-bar';
import { LoadingCardList } from '@/components/custom/loading-card';
import { LoadingHeader } from '@/components/custom/loading-header';
import { RatingList } from '@/components/rating/rating-list';
import { getAct } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/act_service-ActService_connectquery';
import {
  callUnaryMethod,
  createConnectQueryKey,
} from '@connectrpc/connect-query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

export default async function ActPage({
  params,
}: {
  params: Promise<{ actId: string; contestId: string }>;
}) {
  const { actId, contestId } = await params;
  const queryClient = getQueryClient();
  const transport = await getServerTransport();

  queryClient.prefetchQuery({
    queryKey: createConnectQueryKey({
      schema: getAct,
      transport,
      input: { id: actId },
      cardinality: 'finite',
    }),
    queryFn: () => callUnaryMethod(transport, getAct, { id: actId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppBar withBackButton>
        <Suspense fallback={<LoadingHeader />}>
          <ActHeader id={actId} />
        </Suspense>
      </AppBar>
      <div className="mx-auto h-full w-full max-w-3xl px-2 pt-2">
        <Suspense fallback={<LoadingCardList />}>
          <RatingList actId={actId} contestId={contestId} />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
