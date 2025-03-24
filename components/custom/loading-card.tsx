import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const LoadingCard = () => (
  <Card className="flex flex-row">
    <Skeleton className="min-h-fit w-32" />
    <CardHeader>
      <CardTitle>
        <Skeleton className="h-8 w-[100px]" />
      </CardTitle>
      <CardDescription className="flex flex-col gap-2">
        <Skeleton className="mt-2 h-4 w-[175px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardDescription>
    </CardHeader>
  </Card>
);

export const LoadingCardList = () => (
  <div className="flex flex-col gap-2">
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);
