'use client';
import React from 'react';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import ViewSwitcher from '../_components/view-switcher';
import NavigationBarMaintenance from '../_components/navigation-maintenance';

export default function LoadingPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 p-4 pt-16 pb-[120px]">
          <ViewSwitcher />
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <Skeleton className="w-full h-50 rounded-md" />
              <Skeleton className="w-full h-50 rounded-md" />
            </div>
            <Skeleton className="w-full h-70 rounded-md" />
            <div className="flex flex-row gap-4">
              <Skeleton className="w-full h-50 rounded-md" />
              <Skeleton className="w-full h-50 rounded-md" />
            </div>
            <Skeleton className="w-full h-70 rounded-md" />
          </div>
        </div>
      </div>
      <NavigationBarMaintenance />
    </div>
  );
}
