'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { BuildingOverview } from './_components/building-overview';
import NavigationBar from '../_components/navigation';
import { SpacesOverview } from './_components/spaces-overview';
import { Loader2 } from 'lucide-react';
import { FacilitiesOverview } from './_components/facilities-overview';
import { MailOverview } from '../parcels/_components/mail-overview';
import QuickActions from './_components/quick-actions';

export default function HomePage() {
  const router = useRouter();
  const buildings = useQuery(api.site.getAllSites);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
     
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <BuildingOverview buildings={buildings} />
          <QuickActions />
          <SpacesOverview />
          <FacilitiesOverview />
          <MailOverview />
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
