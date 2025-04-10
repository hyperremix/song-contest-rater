import { getQueryClient } from '@/app/get-query-client';
import { getServerTransport } from '@/app/get-server-transport';
import { ActList } from '@/components/act/act-list';
import { ContestHeader } from '@/components/contest/contest-header';
import { AppBar } from '@/components/custom/app-bar';
import { LoadingCardList } from '@/components/custom/loading-card';
import { LoadingHeader } from '@/components/custom/loading-header';
import { getContest } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/contest_service-ContestService_connectquery';
import {
  callUnaryMethod,
  createConnectQueryKey,
} from '@connectrpc/connect-query';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

export default async function ContestPage({
  params,
}: {
  params: Promise<{ contestId: string }>;
}) {
  const id = (await params).contestId;
  const queryClient = getQueryClient();
  const transport = await getServerTransport();

  queryClient.prefetchQuery({
    queryKey: createConnectQueryKey({
      schema: getContest,
      transport,
      input: { id },
      cardinality: 'finite',
    }),
    queryFn: () => callUnaryMethod(transport, getContest, { id }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppBar withBackButton>
        <Suspense fallback={<LoadingHeader />}>
          <ContestHeader id={id} />
        </Suspense>
      </AppBar>
      <div className="mx-auto h-full w-full max-w-3xl px-2 pt-2">
        <Suspense fallback={<LoadingCardList />}>
          <ActList contestId={id} />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
