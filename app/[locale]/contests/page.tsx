import { getQueryClient } from '@/app/get-query-client';
import { getServerTransport } from '@/app/get-server-transport';
import { AdminTab } from '@/components/admin/admin-tab';
import { ContestList } from '@/components/contest/contest-list';
import { AppBar } from '@/components/custom/app-bar';
import { LoadingCardList } from '@/components/custom/loading-card';
import { Typography } from '@/components/custom/typography';
import { StatsList } from '@/components/stats/stats-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { translations } from '@/i18n';
import { listActs } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/act_service-ActService_connectquery';
import { listContests } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/contest_service-ContestService_connectquery';
import { listParticipations } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/participation_service-ParticipationService_connectquery';
import {
  getGlobalStats,
  listUserStats,
} from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/stat_service-StatService_connectquery';
import { currentUser } from '@clerk/nextjs/server';
import {
  callUnaryMethod,
  createConnectQueryKey,
} from '@connectrpc/connect-query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ChartLine, Music, Shield } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

export default async function ContestListPage() {
  const t = await getTranslations();
  const queryClient = getQueryClient();
  const transport = await getServerTransport();
  const user = await currentUser();

  queryClient.prefetchQuery({
    queryKey: createConnectQueryKey({
      schema: listContests,
      transport,
      input: {},
      cardinality: 'finite',
    }),
    queryFn: () => callUnaryMethod(transport, listContests, {}),
  });

  queryClient.prefetchQuery({
    queryKey: createConnectQueryKey({
      schema: listUserStats,
      transport,
      input: {},
      cardinality: 'finite',
    }),
    queryFn: () => callUnaryMethod(transport, listUserStats, {}),
  });

  queryClient.prefetchQuery({
    queryKey: createConnectQueryKey({
      schema: getGlobalStats,
      transport,
      input: {},
      cardinality: 'finite',
    }),
    queryFn: () => callUnaryMethod(transport, getGlobalStats, {}),
  });

  if (user?.publicMetadata.role === 'admin') {
    queryClient.prefetchQuery({
      queryKey: createConnectQueryKey({
        schema: listActs,
        transport,
        input: {},
        cardinality: 'finite',
      }),
      queryFn: () => callUnaryMethod(transport, listActs, {}),
    });

    queryClient.prefetchQuery({
      queryKey: createConnectQueryKey({
        schema: listParticipations,
        transport,
        input: {},
        cardinality: 'finite',
      }),
      queryFn: () => callUnaryMethod(transport, listParticipations, {}),
    });
  }

  return (
    <>
      <AppBar>
        <Typography variant="h2">
          {t(translations.contest.screenTitle)}
        </Typography>
      </AppBar>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Tabs defaultValue="contests" className="w-full">
          <TabsContent value="contests" className="pb-20">
            <div className="mx-auto h-full w-full max-w-3xl px-2 pt-2">
              <Suspense fallback={<LoadingCardList />}>
                <ContestList />
              </Suspense>
            </div>
          </TabsContent>
          <TabsContent value="stats" className="pb-20">
            <div className="mx-auto h-full w-full max-w-3xl px-2 pt-2">
              <Suspense fallback={<LoadingCardList />}>
                <StatsList />
              </Suspense>
            </div>
          </TabsContent>
          <TabsContent value="admin" className="pb-20">
            <Suspense fallback={<LoadingCardList />}>
              <AdminTab />
            </Suspense>
          </TabsContent>
          <TabsList className="fixed bottom-0 left-0 right-0 z-50 h-16 w-full">
            <TabsTrigger className="h-full flex-1 gap-2" value="contests">
              <Music />
              <Typography className="hidden md:block" variant="h3">
                {t(translations.contest.screenTitle)}
              </Typography>
            </TabsTrigger>
            <TabsTrigger className="h-full flex-1 gap-2" value="stats">
              <ChartLine />
              <Typography className="hidden md:block" variant="h3">
                {t(translations.statistics.statsScreenTitle)}
              </Typography>
            </TabsTrigger>
            {user?.publicMetadata.role === 'admin' && (
              <TabsTrigger className="h-full flex-1 gap-2" value="admin">
                <Shield />
                <Typography className="hidden md:block" variant="h3">
                  {t(translations.admin.screenTitle)}
                </Typography>
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </HydrationBoundary>
    </>
  );
}
