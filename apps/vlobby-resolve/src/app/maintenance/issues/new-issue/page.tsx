'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Button } from '@repo/ui/components/ui/button';
import TicketUpsertForm from '../_form/issues-upsert-form';
import Link from 'next/link';

export default function NewIssuePage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 p-4 pt-16 pb-[120px]">
          <Link href="/maintenance/issues" passHref>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create New Issue</h1>
          <TicketUpsertForm />
        </div>
      </div>
    </div>
  );
}
