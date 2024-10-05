'use client';
import React from 'react';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import NavigationBar from '../_components/navigation';
import QuickActions from './_components/quick-actions';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@tremor/react';
import { SpacesIconPath } from '../../../public/svg/icons';

export default function LoadingPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          {/* Building Overview Skeleton */}
          <div className="w-full">
            <div className="flex flex-row gap-2 items-center mb-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-40 h-6" />
            </div>
            <Skeleton className="w-full h-40 rounded-lg" />
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Spaces Overview Skeleton */}
          <div className="w-full">
            <div className="flex flex-row gap-2 items-center mb-2">
              <div className="w-5 h-5 fill-foreground">
                <SpacesIconPath />
              </div>
              <h2 className="text-xl font-semibold">Spaces</h2>
              <Badge size="xs" color="purple" className="opacity-50">
                Loading...
              </Badge>
            </div>
            <div className="flex gap-4 overflow-x-auto">
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-80 h-60 rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Facilities Overview Skeleton */}
          <div className="w-full">
            <div className="flex flex-row gap-2 items-center mb-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-40 h-6" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Mail Overview Skeleton */}
          <div className="w-full">
            <div className="flex flex-row gap-2 items-center mb-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-40 h-6" />
            </div>
            <Skeleton className="w-full h-40 rounded-lg" />
          </div>

          {/* Disabled Buttons */}
          <div className="flex gap-2 mt-4">
            <Button disabled>Action 1</Button>
            <Button disabled>Action 2</Button>
          </div>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
