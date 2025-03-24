import { Skeleton } from '../ui/skeleton';

export const LoadingHeader = () => (
  <div className="flex flex-col items-center gap-1">
    <Skeleton className="size-32" />
    <Skeleton className="h-8 w-[150px]" />
    <Skeleton className="h-4 w-[175px]" />
  </div>
);
