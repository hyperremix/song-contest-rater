'use client';

import { Typography } from '@/components/custom/typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';
import { ActsTable } from './acts-table';
import { ContestsTable } from './contests-table';
import { ParticipationsTable } from './participations-table';

export const AdminTab = () => {
  return (
    <div className="container mx-auto py-6">
      <Typography variant="h2" className="mb-6">
        Admin Dashboard
      </Typography>

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
    </div>
  );
};
