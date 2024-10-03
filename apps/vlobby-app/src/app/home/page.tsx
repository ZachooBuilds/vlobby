'use client';

import React, { useEffect } from 'react';
import { useOrganizationList, useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';
import { SignOutButton } from '../(auth)/_components/sign-out-button';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { BuildingOverview } from './_components/building-overview';
import NavigationBar from '../_components/navigation';
import { SpacesOverview } from './_components/spaces-overview';
import { Loader2 } from 'lucide-react';
import { FacilitiesOverview } from './_components/facilities-overview';
import { MailOverview } from '../parcels/_components/mail-overview';

export default function HomePage() {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const {
    isLoaded: isOrgLoaded,
    setActive,
    userMemberships,
  } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const router = useRouter();

  const bannerImage = useQuery(api.theme.getBannerImage);
  const buildings = useQuery(api.site.getAllSites);

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
          <BuildingOverview buildings={buildings} />
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
