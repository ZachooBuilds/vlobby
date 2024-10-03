'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import NavigationBar from '../_components/navigation';
import { Loader2 } from 'lucide-react';
import { MailOverview } from './_components/mail-overview';
import { CollectedMailOverview } from './_components/collected-mail-overview';
import { useOrganizationList, useUser } from '@clerk/clerk-react';

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
          <MailOverview />
          <CollectedMailOverview />
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
