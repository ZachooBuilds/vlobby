'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { LoadingSpinner } from '../../_components/loading spinner';
import { Button } from '@repo/ui/components/ui/button';
import TicketUpsertForm from '../_form/issues-upsert-form';

export default function NewIssuePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn || !user) {
    return <LoadingSpinner />;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Create New Issue</h1>
            <TicketUpsertForm />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
