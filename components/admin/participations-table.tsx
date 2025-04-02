'use client';

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
import { listActs } from '@/utils/http/act';
import { listContests } from '@/utils/http/contest';
import {
  createParticipation,
  deleteParticipation,
  listParticipations,
} from '@/utils/http/participation';
import { Heat } from '@hyperremix/song-contest-rater-proto/competition';
import {
  CreateParticipationRequest,
  ListParticipationsResponse,
} from '@hyperremix/song-contest-rater-proto/participation';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, Plus, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '../ui/input';

type DeleteParticipationRequest = {
  contest_id: string;
  act_id: string;
};

type ParticipationData = {
  competitionId: string;
  competitionCity: string;
  competitionCountry: string;
  competitionHeat: Heat;
  actId: string;
  actArtist: string;
  actSong: string;
  order: number;
};

export const ParticipationsTable = () => {
  const t = useTranslations();
  const queryClient = getQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedContestId, setSelectedContestId] = useState<string>('');
  const [selectedActId, setSelectedActId] = useState<string>('');
  const [order, setOrder] = useState<number>(1);

  const { data: contestsData } = useSuspenseQuery({
    queryKey: ['listContests'],
    queryFn: listContests,
  });

  const { data: actsData } = useSuspenseQuery({
    queryKey: ['listActs'],
    queryFn: listActs,
  });

  const { data: participationsData } = useSuspenseQuery({
    queryKey: ['listParticipations'],
    queryFn: listParticipations,
  });

  const participations: ParticipationData[] = useMemo(
    () =>
      participationsData?.participations.map((participation) => {
        const competition = contestsData?.competitions.find(
          (competition) => competition.id === participation.competition_id,
        );
        const act = actsData?.acts.find(
          (act) => act.id === participation.act_id,
        );

        return {
          competitionId: participation.competition_id,
          competitionCity: competition?.city ?? '',
          competitionCountry: competition?.country ?? '',
          competitionHeat: competition?.heat ?? 1,
          actId: participation.act_id,
          actArtist: act?.artist_name ?? '',
          actSong: act?.song_name ?? '',
          order: participation.order,
        };
      }),
    [participationsData, contestsData, actsData],
  );

  const availableActs = useMemo(() => {
    return actsData?.acts.filter(
      (act) =>
        !participations.some(
          (p) => p.actId === act.id && p.competitionId === selectedContestId,
        ),
    );
  }, [actsData, participations, selectedContestId]);

  useEffect(() => {
    setOrder(
      participations.filter((p) => p.competitionId === selectedContestId)
        .length + 1,
    );
  }, [selectedContestId, participations]);

  const columns: ColumnDef<ParticipationData>[] = [
    {
      accessorKey: 'competitionCity',
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
      accessorKey: 'competitionCountry',
      header: 'Country',
    },
    {
      accessorKey: 'competitionHeat',
      header: 'Heat',
      cell: ({ row }) => t(`contest.heat.${row.getValue('competitionHeat')}`),
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
              contest_id: row.original.competitionId,
              act_id: row.original.actId,
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

  const createMutation = useMutation({
    mutationFn: (createRequest: CreateParticipationRequest) =>
      createParticipation(createRequest),
    onMutate: async (createRequest: CreateParticipationRequest) => {
      await queryClient.cancelQueries({ queryKey: ['listParticipations'] });
      const previousList = queryClient.getQueryData<ListParticipationsResponse>(
        ['listParticipations'],
      );

      queryClient.setQueryData(
        ['listParticipations'],
        (old: ListParticipationsResponse) => ({
          ...old,
          participations: [
            ...old.participations,
            {
              id: 'temp-id',
              ...createRequest,
              created_at: undefined,
              updated_at: undefined,
            },
          ],
        }),
      );

      return { previousList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['listParticipations'], context?.previousList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listParticipations'] });
      setSelectedContestId('');
      setSelectedActId('');
      setOrder(1);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (deleteRequest: DeleteParticipationRequest) =>
      deleteParticipation(deleteRequest.contest_id, deleteRequest.act_id),
    onMutate: async (deleteRequest: DeleteParticipationRequest) => {
      await queryClient.cancelQueries({ queryKey: ['listParticipations'] });
      const previousList = queryClient.getQueryData<ListParticipationsResponse>(
        ['listParticipations'],
      );

      queryClient.setQueryData(
        ['listParticipations'],
        (old: ListParticipationsResponse) => ({
          ...old,
          participations: old.participations.filter(
            (participation) =>
              !(
                participation.competition_id === deleteRequest.contest_id &&
                participation.act_id === deleteRequest.act_id
              ),
          ),
        }),
      );

      return { previousList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['listParticipations'], context?.previousList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listParticipations'] });
    },
  });

  const handleAddParticipation = useCallback(() => {
    if (!selectedContestId || !selectedActId) return;

    createMutation.mutate({
      competition_id: selectedContestId,
      act_id: selectedActId,
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
                  {contestsData?.competitions.map((contest) => (
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
                      {act.artist_name} - {act.song_name}
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
