import { getQueryClient } from '@/app/get-query-client';
import { ActList } from '@/components/act/act-list';
import { ContestHeader } from '@/components/contest/contest-header';
import { AppBar } from '@/components/custom/app-bar';
import { LoadingCardList } from '@/components/custom/loading-card';
import { LoadingHeader } from '@/components/custom/loading-header';
import { getContest } from '@/utils/http/contest';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

export default async function ContestPage({
  params,
}: {
  params: Promise<{ contestId: string }>;
}) {
  const id = (await params).contestId;
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ['getContest', id],
    queryFn: () => getContest(id),
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
