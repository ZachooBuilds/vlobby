import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@repo/ui/components/ui/skeleton';

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
        <div className="flex flex-row items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-40 h-6" />
        </div>
        
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} className="w-full h-40 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
