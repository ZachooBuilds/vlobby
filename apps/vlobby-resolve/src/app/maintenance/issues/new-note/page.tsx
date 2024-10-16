'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Button } from '@repo/ui/components/ui/button';
import TicketUpsertForm from '../_form/issues-upsert-form';
import Link from 'next/link';
import GlobalNoteForm from '../_form/global-note-form';

export default function NewNotePage() {
  const searchParams = useSearchParams();
  const issueId = searchParams.get('issueId');

  if (!issueId) {
    return <div>Error: Issue ID is missing</div>;
  }

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
          <h1 className="text-2xl font-bold">Add New Note</h1>
          <GlobalNoteForm noteType={'issue'} entityId={issueId} />
        </div>
      </div>
    </div>
  );
}
