import React from 'react';
import { Skeleton } from '@repo/ui/components/ui/skeleton';

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Skeleton className="w-full max-w-3xl h-[80vh] rounded-lg" />
    </div>
  );
}
