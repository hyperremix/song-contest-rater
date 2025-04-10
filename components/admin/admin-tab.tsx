import { getBrowserTransport } from '@/app/get-browser-transport';
import { getQueryClient } from '@/app/get-query-client';
import { Typography } from '@/components/custom/typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { listActs } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/act_service-ActService_connectquery';
import { listContests } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/contest_service-ContestService_connectquery';
import { listParticipations } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/participation_service-ParticipationService_connectquery';
import {
  callUnaryMethod,
  createConnectQueryKey,
} from '@connectrpc/connect-query';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ActsTable } from './acts-table';
import { ContestsTable } from './contests-table';
import { ParticipationsTable } from './participations-table';

export const AdminTab = async () => {
  const queryClient = getQueryClient();
  const transport = getBrowserTransport();

  await queryClient.prefetchQuery({
    queryKey: createConnectQueryKey({
      schema: listContests,
      transport,
      input: {},
      cardinality: 'finite',
    }),
    queryFn: () => callUnaryMethod(transport, listContests, {}),
  });

  await queryClient.prefetchQuery({
    queryKey: createConnectQueryKey({
      schema: listActs,
      transport,
      input: {},
      cardinality: 'finite',
    }),
    queryFn: () => callUnaryMethod(transport, listActs, {}),
  });

  await queryClient.prefetchQuery({
    queryKey: createConnectQueryKey({
      schema: listParticipations,
      transport,
      input: {},
      cardinality: 'finite',
    }),
    queryFn: () => callUnaryMethod(transport, listParticipations, {}),
  });

  return (
    <div className="container mx-auto py-6">
      <Typography variant="h2" className="mb-6">
        Admin Dashboard
      </Typography>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Tabs defaultValue="contests" className="w-full">
          <TabsList className="dark:bg-zinc-900">
            <TabsTrigger value="contests">Contests</TabsTrigger>
            <TabsTrigger value="acts">Acts</TabsTrigger>
            <TabsTrigger value="participations">Participations</TabsTrigger>
          </TabsList>

          <TabsContent value="contests">
            <Suspense fallback={<div>Loading contests...</div>}>
              <ContestsTable />
            </Suspense>
          </TabsContent>

          <TabsContent value="acts">
            <Suspense fallback={<div>Loading acts...</div>}>
              <ActsTable />
            </Suspense>
          </TabsContent>

          <TabsContent value="participations">
            <Suspense fallback={<div>Loading participations...</div>}>
              <ParticipationsTable />
            </Suspense>
          </TabsContent>
        </Tabs>
      </HydrationBoundary>
    </div>
  );
};
