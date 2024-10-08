'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import NavigationBar from '../_components/navigation';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { viewOptions } from '../../lib/staticData';
import ViewSwitcher from '../_components/view-switcher';

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
          <div className="w-full mb-4 w-full">
            <ViewSwitcher />
          </div>
          maintenance page
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
