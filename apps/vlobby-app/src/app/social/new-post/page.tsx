'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft } from 'lucide-react';
import FeedPostUpsertForm from '../_forms/new-post';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { LoadingSpinner } from '../../_components/loading spinner';
import { Button } from '@repo/ui/components/ui/button';

export default function NewPostPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
            <Link href="/social" passHref>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create New Post</h1>
            <FeedPostUpsertForm />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
