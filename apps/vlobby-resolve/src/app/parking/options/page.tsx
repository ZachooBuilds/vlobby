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
import { Button } from '@repo/ui/components/ui/button';
import { CameraIcon } from 'lucide-react';

export default function OptionsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleCapturedPhotos = (capturedFiles: File[]) => {
    const updatedFiles = [...currentFiles, ...capturedFiles];
    setCurrentFiles(updatedFiles);
    setIsCameraOpen(false);
  };

  if (isCameraOpen) {
    return <MultiImageCapture onCapture={handleCapturedPhotos} onClose={() => setIsCameraOpen(false)} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <Tabs defaultValue="search" className="w-full bg-white">
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
          <Button
            onClick={() => setIsCameraOpen(true)}
            variant="outline"
            className="w-full"
            type="button"
          >
            <CameraIcon className="mr-2 h-4 w-4" />
            Open Camera
          </Button>
        </div>
      </div>
      <div className="w-full bg-white">
        <NavigationBar />
      </div>
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
