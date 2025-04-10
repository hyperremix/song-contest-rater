'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import { getQueryClient } from '@/app/get-query-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Heat } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/contest_pb';
import { ListParticipationsResponse } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/participation_pb';
import { listActs } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/act_service-ActService_connectquery';
import { listContests } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/contest_service-ContestService_connectquery';
import {
  createParticipation,
  deleteParticipation,
  listParticipations,
} from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/participation_service-ParticipationService_connectquery';
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
import { ArrowUpDown, Plus, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '../ui/input';

type ParticipationData = {
  contestId: string;
  contestCity: string;
  contestCountry: string;
  contestHeat: Heat;
  actId: string;
  actArtist: string;
  actSong: string;
  order: number;
};

export const ParticipationsTable = () => {
  const t = useTranslations();
  const queryClient = getQueryClient();
  const transport = getBrowserTransport();

  const listParticipationsQueryKey = createConnectQueryKey({
    schema: listParticipations,
    transport,
    input: {},
    cardinality: 'finite',
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedContestId, setSelectedContestId] = useState<string>('');
  const [selectedActId, setSelectedActId] = useState<string>('');
  const [order, setOrder] = useState<number>(1);

  const { data: contestsData } = useSuspenseQuery(
    listContests,
    {},
    { transport },
  );

  const { data: actsData } = useSuspenseQuery(listActs, {}, { transport });

  const { data: participationsData } = useSuspenseQuery(
    listParticipations,
    {},
    { transport },
  );

  const participations: ParticipationData[] = useMemo(
    () =>
      participationsData?.participations.map((participation) => {
        const contest = contestsData?.contests.find(
          (contest) => contest.id === participation.contestId,
        );
        const act = actsData?.acts.find(
          (act) => act.id === participation.actId,
        );

        return {
          contestId: contest?.id ?? '',
          contestCity: contest?.city ?? '',
          contestCountry: contest?.country ?? '',
          contestHeat: contest?.heat ?? 1,
          actId: act?.id ?? '',
          actArtist: act?.artistName ?? '',
          actSong: act?.songName ?? '',
          order: participation.order,
        };
      }),
    [participationsData, contestsData, actsData],
  );

  const availableActs = useMemo(() => {
    return actsData?.acts.filter(
      (act) =>
        !participations.some(
          (p) => p.actId === act.id && p.contestId === selectedContestId,
        ),
    );
  }, [actsData, participations, selectedContestId]);

  useEffect(() => {
    setOrder(
      participations.filter((p) => p.contestId === selectedContestId).length +
        1,
    );
  }, [selectedContestId, participations]);

  const columns: ColumnDef<ParticipationData>[] = [
    {
      accessorKey: 'contestCity',
      header: ({ column }) => (
        <div className="flex items-center">
          Contest City
          <ArrowUpDown
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        </div>
      ),
    },
    {
      accessorKey: 'contestCountry',
      header: 'Country',
    },
    {
      accessorKey: 'contestHeat',
      header: 'Heat',
      cell: ({ row }) => t(`contest.heat.${row.getValue('contestHeat')}`),
    },
    {
      accessorKey: 'actArtist',
      header: ({ column }) => (
        <div className="flex items-center">
          Artist
          <ArrowUpDown
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        </div>
      ),
    },
    {
      accessorKey: 'actSong',
      header: 'Song',
    },
    {
      accessorKey: 'order',
      size: 1,
      header: ({ column }) => (
        <div className="flex items-center">
          Order
          <ArrowUpDown
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          />
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 1,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            deleteMutation.mutate({
              contestId: row.original.contestId,
              actId: row.original.actId,
            })
          }
        >
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: participations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const createMutation = useMutation(createParticipation, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: listParticipationsQueryKey });
      const previousList = queryClient.getQueryData<ListParticipationsResponse>(
        listParticipationsQueryKey,
      );

      queryClient.setQueryData(
        listParticipationsQueryKey,
        (old: ListParticipationsResponse) => ({
          ...old,
          participations: [
            ...old.participations,
            {
              id: 'temp-id',
              ...variables,
              createdAt: undefined,
              updatedAt: undefined,
            },
          ],
        }),
      );

      return { previousList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        listParticipationsQueryKey,
        context?.previousList,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listParticipationsQueryKey });
      setSelectedContestId('');
      setSelectedActId('');
      setOrder(1);
    },
  });

  const deleteMutation = useMutation(deleteParticipation, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: listParticipationsQueryKey });
      const previousList = queryClient.getQueryData<ListParticipationsResponse>(
        listParticipationsQueryKey,
      );

      queryClient.setQueryData(
        listParticipationsQueryKey,
        (old: ListParticipationsResponse) => ({
          ...old,
          participations: old.participations.filter(
            (participation) =>
              !(
                participation.contestId === variables.contestId &&
                participation.actId === variables.actId
              ),
          ),
        }),
      );

      return { previousList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        listParticipationsQueryKey,
        context?.previousList,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listParticipationsQueryKey });
    },
  });

  const handleAddParticipation = useCallback(() => {
    if (!selectedContestId || !selectedActId) return;

    createMutation.mutate({
      contestId: selectedContestId,
      actId: selectedActId,
      order: order,
    });
  }, [createMutation, selectedContestId, selectedActId, order]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Participations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 mb-4 rounded-md p-4">
          <h3 className="mb-4 text-lg font-medium">Add New Participation</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Contest</label>
              <Select
                value={selectedContestId}
                onValueChange={setSelectedContestId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contest" />
                </SelectTrigger>
                <SelectContent>
                  {contestsData?.contests.map((contest) => (
                    <SelectItem key={contest.id} value={contest.id}>
                      {contest.city}, {contest.country} (
                      {t(`contest.heat.${contest.heat}`)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Act</label>
              <Select value={selectedActId} onValueChange={setSelectedActId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select act" />
                </SelectTrigger>
                <SelectContent>
                  {availableActs?.map((act) => (
                    <SelectItem key={act.id} value={act.id}>
                      {act.artistName} - {act.songName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Order</label>
              <Input
                min="1"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="border-input bg-background w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleAddParticipation}
                disabled={
                  !selectedContestId ||
                  !selectedActId ||
                  createMutation.isPending
                }
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Participation
              </Button>
            </div>
          </div>
        </div>

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
                    No participations found.
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
      </CardContent>
    </Card>
  );
};
