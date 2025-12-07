import { Skeleton } from './ui/skeleton';

export function PredictionCardSkeleton() {
  return (
    <div className="bg-card border-b border-border px-4 py-4 space-y-3" dir="rtl">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Question Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      {/* Tags Skeleton */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-14 rounded-md" />
      </div>

      {/* Options Skeleton */}
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>

      {/* Actions Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}
