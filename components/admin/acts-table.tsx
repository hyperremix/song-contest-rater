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
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import {
  Act,
  ListActsResponse,
} from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/act_pb';
import {
  createAct,
  deleteAct,
  listActs,
  updateAct,
} from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/act_service-ActService_connectquery';
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
import { useFormatter } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CreateActDialog } from './create-act-dialog';
import { UpdateActDialog } from './update-act-dialog';

export const ActsTable = () => {
  const formatter = useFormatter();
  const queryClient = getQueryClient();
  const transport = getBrowserTransport();
  const listActsQueryKey = createConnectQueryKey({
    schema: listActs,
    transport,
    input: {},
    cardinality: 'finite',
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedAct, setSelectedAct] = useState<Act | null>(null);

  const {
    data: { acts },
  } = useSuspenseQuery(listActs, {}, { transport });

  const createMutation = useMutation(createAct, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: listActsQueryKey });
      const previousActsList = queryClient.getQueryData<ListActsResponse>([
        listActsQueryKey,
      ]);

      queryClient.setQueryData(listActsQueryKey, (old: ListActsResponse) => ({
        ...old,
        acts: [
          ...old.acts,
          {
            id: 'temp-id',
            ...variables,
            created_at: undefined,
            updated_at: undefined,
          },
        ],
      }));

      return { previousActsList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(listActsQueryKey, context?.previousActsList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listActsQueryKey });
    },
  });

  const updateMutation = useMutation(updateAct, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: listActsQueryKey });
      const previousActsList = queryClient.getQueryData<ListActsResponse>([
        listActsQueryKey,
      ]);

      queryClient.setQueryData(listActsQueryKey, (old: ListActsResponse) => ({
        ...old,
        acts: old.acts.map((act) =>
          act.id === variables.id ? { ...act, ...variables } : act,
        ),
      }));

      return { previousActsList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(listActsQueryKey, context?.previousActsList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listActsQueryKey });
    },
  });

  const deleteMutation = useMutation(deleteAct, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: listActsQueryKey });
      const previousActsList = queryClient.getQueryData<ListActsResponse>([
        listActsQueryKey,
      ]);

      queryClient.setQueryData(listActsQueryKey, (old: ListActsResponse) => ({
        ...old,
        acts: old.acts.filter((act) => act.id !== variables.id),
      }));

      return { previousActsList };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(listActsQueryKey, context?.previousActsList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listActsQueryKey });
    },
  });

  const handleEditAct = (act: Act) => {
    setSelectedAct(act);
    setIsUpdateDialogOpen(true);
  };

  const columns: ColumnDef<Act>[] = [
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
            alt={row.getValue('artist_name')}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
      ),
    },
    {
      accessorKey: 'artist_name',
      header: 'Artist',
    },
    {
      accessorKey: 'song_name',
      header: 'Song',
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        if (!createdAt) return 'N/A';

        const date = new Date(
          Number(createdAt.seconds || 0) * 1000 +
            Number(createdAt.nanos || 0) / 1000000,
        );
        return formatter.dateTime(date, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
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
            onClick={() => handleEditAct(row.original)}
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
    data: acts || [],
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
          Acts
          <Button onClick={() => setIsCreateDialogOpen(true)}>Add Act</Button>
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
                    No acts found.
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
        <CreateActDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSave={createMutation.mutate}
        />
        <UpdateActDialog
          act={selectedAct}
          isOpen={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onSave={updateMutation.mutate}
        />
      </CardContent>
    </Card>
  );
};
