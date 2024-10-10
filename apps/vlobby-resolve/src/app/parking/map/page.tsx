'use client';

import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import NavigationBar from '../../_components/navigation';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import CarParkMap from './_components/parkingMapLoader';

export default function MapPage() {

  return (
    <div className="flex flex-col h-screen">
      <Card className="flex-grow overflow-hidden">
        <div className="flex flex-col gap-4 items-start justify-start h-full pt-16 p-4 pb-[120px] w-full">
          <CarParkMap />
        </div>
      </Card>
      <NavigationBar />
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
