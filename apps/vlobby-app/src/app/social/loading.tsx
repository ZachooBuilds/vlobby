import React from 'react';
import NavigationBar from '../_components/navigation';
import { Skeleton } from '@repo/ui/components/ui/skeleton';


export default function SocialLoadingPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          {/* Page Header */}
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
          </div>

          {/* Social Options */}
          <div className="flex flex-row w-full gap-2">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex flex-col gap-2 items-center p-4 rounded flex-1"
              >
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="w-full space-y-4">
            {[1, 2, 3].map((index) => (
              <Skeleton key={index} className="h-24 w-full rounded" />
            ))}
          </div>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
