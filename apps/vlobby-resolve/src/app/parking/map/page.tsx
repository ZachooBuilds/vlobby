'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import NavigationBar from '../../_components/navigation';
import { Card } from '@repo/ui/components/ui/card';
import CarParkMap from './_components/parkingMapLoader';
import { Loader2 } from 'lucide-react';

export default function MapPage() {
  const searchParams = useSearchParams();
  const [mapParams, setMapParams] = useState({
    vehicleId: '',
  });

  useEffect(() => {
    setMapParams({
      vehicleId: searchParams.get('vehicleId') || '',
    });
  }, [searchParams]);

  return (
    <div className="flex flex-col h-screen">
      <Card className="flex-grow overflow-hidden">
        <div className="flex flex-col gap-4 items-start justify-start h-full pt-16 p-4 pb-[120px] w-full">
          <CarParkMap
            vehicleId={mapParams.vehicleId}
          />
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
