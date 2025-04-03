'use client';

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
import { toContestResponse } from '@/utils/contest/toContestResponse';
import {
  createContest,
  deleteContest,
  listContests,
  updateContest,
} from '@/utils/http/contest';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import {
  CompetitionResponse,
  CreateCompetitionRequest,
  ListCompetitionsResponse,
  UpdateCompetitionRequest,
} from '@hyperremix/song-contest-rater-protos/competition';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedContest, setSelectedContest] =
    useState<CompetitionResponse | null>(null);

  const { data } = useSuspenseQuery({
    queryKey: ['listContests'],
    queryFn: listContests,
  });

  const createMutation = useMutation({
    mutationFn: (createContestRequest: CreateCompetitionRequest) =>
      createContest(createContestRequest),
    onMutate: async (createContestRequest: CreateCompetitionRequest) => {
      await queryClient.cancelQueries({ queryKey: ['listContests'] });
      const previousContestList =
        queryClient.getQueryData<ListCompetitionsResponse>(['listContests']);

      queryClient.setQueryData(
        ['listContests'],
        (old: ListCompetitionsResponse) => ({
          ...old,
          competitions: [
            ...old.competitions,
            toContestResponse(createContestRequest, []),
          ],
        }),
      );

      return { previousContestList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['listContests'], context?.previousContestList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listContests'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updateContestRequest: UpdateCompetitionRequest) =>
      updateContest(updateContestRequest),
    onMutate: async (updateContestRequest: UpdateCompetitionRequest) => {
      await queryClient.cancelQueries({ queryKey: ['listContests'] });
      const previousContestList =
        queryClient.getQueryData<ListCompetitionsResponse>(['listContests']);

      queryClient.setQueryData(
        ['listContests'],
        (old: ListCompetitionsResponse) => ({
          ...old,
          competitions: old.competitions.map((competition) =>
            competition.id === updateContestRequest.id
              ? toContestResponse(updateContestRequest, competition.acts)
              : competition,
          ),
        }),
      );

      return { previousContestList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['listContests'], context?.previousContestList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listContests'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContest(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['listContests'] });
      const previousContestList =
        queryClient.getQueryData<ListCompetitionsResponse>(['listContests']);

      queryClient.setQueryData(
        ['listContests'],
        (old: ListCompetitionsResponse) => ({
          ...old,
          competitions: old.competitions.filter(
            (competition) => competition.id !== id,
          ),
        }),
      );

      return { previousContestList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['listContests'], context?.previousContestList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listContests'] });
    },
  });

  const handleEditContest = (contest: CompetitionResponse) => {
    setSelectedContest(contest);
    setIsUpdateDialogOpen(true);
  };

  const columns: ColumnDef<CompetitionResponse>[] = [
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
      accessorKey: 'start_time',
      header: 'Start Time',
      cell: ({ row }) => {
        const startTime = row.original.start_time;
        if (!startTime) return 'N/A';

        return formatter.dateTime(
          (startTime.seconds || 0) * 1000 + (startTime.nanos || 0) / 1000000,
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
            onClick={() => deleteMutation.mutate(row.original.id)}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.competitions || [],
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
