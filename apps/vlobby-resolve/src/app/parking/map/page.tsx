'use client';

import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import NavigationBar from '../../_components/navigation';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import CarParkMap from './_components/parkingMapLoader';

export default function MapPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="flex flex-col h-screen">
      <Card className="flex-grow overflow-hidden">
        <CardContent className="h-full p-0">
          <CarParkMap />
        </CardContent>
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
