'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import NavigationBarMaintenance from '../../_components/navigation-maintenance';
import UnderConstructionMessage from '../../_components/under-construction';
import { LockIconPath, SettingIconPath } from '../../../../public/svg/icons';
import { CardHeader, CardTitle } from '@repo/ui/components/ui/card';

export default function AccessPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-5 h-5 fill-foreground">
                <LockIconPath />
              </div>
              Access Control
            </CardTitle>
          </CardHeader>
          <UnderConstructionMessage />
        </div>
      </div>
      <NavigationBarMaintenance />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
