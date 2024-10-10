'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import NavigationBar from '../../_components/navigation';
import VehicleSearch from './_components/search';
import DropoffSearch from './_components/dropoff';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@repo/ui/components/ui/tabs';
import { FileUploadWithPreview } from '../../_components/file-upload-form-field';
import NewDropoffRequestForm from './_forms/new-dropoff-request';
import MultiImageCapture from '../../_components/multi-image-capture';

export default function OptionsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  const [currentFiles, setCurrentFiles] = useState<File[]>([]);

  const handleCapturedPhotos = (capturedFiles: File[]) => {
    // const currentFiles = form.getValues('evidenceImages') || [];
    const updatedFiles = [...currentFiles, ...capturedFiles];
    // form.setValue('evidenceImages', updatedFiles);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <Tabs defaultValue="search" className="w-full bg-background">
            <TabsList className="grid w-full grid-cols-2 h-14">
              <TabsTrigger value="search" className="h-full">
                Request Vehicle
              </TabsTrigger>
              <TabsTrigger value="dropoff" className="h-full">
                Dropoff Vehicle
              </TabsTrigger>
            </TabsList>
            <TabsContent value="search">
              <VehicleSearch />
            </TabsContent>
            <TabsContent value="dropoff" className="flex flex-col h-full">
              <DropoffSearch />
              <div>
                <NewDropoffRequestForm />
              </div>
            </TabsContent>
          </Tabs>
          <div className="w-full aspect-[3/4] relative">
            <MultiImageCapture onCapture={handleCapturedPhotos} />
          </div>
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
