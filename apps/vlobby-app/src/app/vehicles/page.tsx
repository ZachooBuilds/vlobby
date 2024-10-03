'use client';

import React, { useEffect } from 'react';
import { useUser, useOrganizationList } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import NavigationBar from '../_components/navigation';
import { Loader2 } from 'lucide-react';
import { VehicleOverview } from './_components/vehicle-overview';
import { AllocationOverview } from './_components/allocation-overview';
import { Button } from '@repo/ui/components/ui/button';
import useDrawerStore from '../../lib/global-state';
import { RequestVehicleForm } from './_forms/request-vehicle';

export default function VehiclesPage() {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const { isLoaded: isOrgLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (isUserLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isUserLoaded, isSignedIn, router]);

  if (!isUserLoaded || !isOrgLoaded || !isSignedIn || !user) {
    return <LoadingSpinner />;
  }

  

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

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
