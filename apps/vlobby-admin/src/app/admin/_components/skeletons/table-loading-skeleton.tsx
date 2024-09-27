import { Skeleton } from "@repo/ui/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <>
      <div className="flex w-full justify-between">
        <Skeleton className="h-8 w-1/3" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <Skeleton className="flex-grow" />
    </>
  );
}
