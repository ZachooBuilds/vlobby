'use client';

import React from 'react';
import NavigationBar from '../_components/navigation';
import { Loader2 } from 'lucide-react';
import { VehicleOverview } from './_components/vehicle-overview';
import { AllocationOverview } from './_components/allocation-overview';

export default function VehiclesPage() {

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <VehicleOverview />
          <AllocationOverview />
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
