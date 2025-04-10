'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import { getQueryClient } from '@/app/get-query-client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toContest } from '@/utils/contest/toContest';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import {
  Contest,
  CreateContestRequestSchema,
  ListContestsResponse,
  UpdateContestRequestSchema,
} from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/contest_pb';
import {
  createContest,
  deleteContest,
  listContests,
  updateContest,
} from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/contest_service-ContestService_connectquery';
import { create } from '@bufbuild/protobuf';
import {
  createConnectQueryKey,
  useMutation,
  useSuspenseQuery,
} from '@connectrpc/connect-query';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CreateContestDialog } from './create-contest-dialog';
import { UpdateContestDialog } from './update-contest-dialog';

export const ContestsTable = () => {
  const t = useTranslations();
  const formatter = useFormatter();
  const queryClient = getQueryClient();
  const transport = getBrowserTransport();

  const listContestsQueryKey = createConnectQueryKey({
    schema: listContests,
    transport,
    input: {},
    cardinality: 'finite',
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const { data } = useSuspenseQuery(listContests, {}, { transport });

  const createMutation = useMutation(createContest, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: listContestsQueryKey });
      const previousContestList =
        queryClient.getQueryData<ListContestsResponse>(listContestsQueryKey);

      queryClient.setQueryData(
        listContestsQueryKey,
        (old: ListContestsResponse) => ({
          ...old,
          contests: [
            ...old.contests,
            toContest(create(CreateContestRequestSchema, variables), []),
          ],
        }),
      );

      return { previousContestList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        listContestsQueryKey,
        context?.previousContestList,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listContestsQueryKey });
    },
  });

  const updateMutation = useMutation(updateContest, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: listContestsQueryKey });
      const previousContestList =
        queryClient.getQueryData<ListContestsResponse>(listContestsQueryKey);

      queryClient.setQueryData(
        listContestsQueryKey,
        (old: ListContestsResponse) => ({
          ...old,
          contests: old.contests.map((contest) =>
            contest.id === variables.id
              ? toContest(
                  create(UpdateContestRequestSchema, variables),
                  contest.acts,
                )
              : contest,
          ),
        }),
      );

      return { previousContestList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        listContestsQueryKey,
        context?.previousContestList,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listContestsQueryKey });
    },
  });

  const deleteMutation = useMutation(deleteContest, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: listContestsQueryKey });
      const previousContestList =
        queryClient.getQueryData<ListContestsResponse>(listContestsQueryKey);

      queryClient.setQueryData(
        listContestsQueryKey,
        (old: ListContestsResponse) => ({
          ...old,
          contests: old.contests.filter(
            (contest) => contest.id !== variables.id,
          ),
        }),
      );

      return { previousContestList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        listContestsQueryKey,
        context?.previousContestList,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listContestsQueryKey });
    },
  });

  const handleEditContest = (contest: Contest) => {
    setSelectedContest(contest);
    setIsUpdateDialogOpen(true);
  };

  const columns: ColumnDef<Contest>[] = [
    {
      accessorKey: 'image_url',
      header: 'Image',
      size: 1,
      cell: ({ row }) => (
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={toImagekitUrl(row.getValue('image_url'), [
              { height: '40', width: '40', focus: 'auto' },
            ])}
            alt={row.getValue('city')}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
      ),
    },
    {
      accessorKey: 'heat',
      header: 'Heat',
      cell: ({ row }) => t(`contest.heat.${row.getValue('heat')}`),
    },
    {
      accessorKey: 'city',
      header: 'City',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
      cell: ({ row }) => {
        const startTime = row.original.startTime;
        if (!startTime) return 'N/A';

        return formatter.dateTime(
          Number(startTime.seconds || 0) * 1000 +
            Number(startTime.nanos || 0) / 1000000,
          {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            weekday: 'short',
          },
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 1,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditContest(row.original)}
          >
            <Edit className="h-4 w-4 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate({ id: row.original.id })}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.contests || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Contests
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Add Contest
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No contests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <CreateContestDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSave={createMutation.mutate}
        />
        <UpdateContestDialog
          contest={selectedContest}
          isOpen={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onSave={updateMutation.mutate}
        />
      </CardContent>
    </Card>
  );
};
