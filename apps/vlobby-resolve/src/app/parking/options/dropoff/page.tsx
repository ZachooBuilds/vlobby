'use client';

import React, { useState } from 'react';
import NavigationBar from '../../../_components/navigation';
import NewDropoffRequestForm from '../_forms/new-dropoff-request';
import MultiImageCapture from '../../../_components/multi-image-capture';
import { Button } from '@repo/ui/components/ui/button';
import { CameraIcon } from 'lucide-react';
import ParkingOptionsTabs from '../_components/tab-menu';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { ParkIconPath } from '../../../../../public/svg/icons';

export default function DropoffPage() {
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleCapturedPhotos = (capturedFiles: File[]) => {
    const updatedFiles = [...currentFiles, ...capturedFiles];
    setCurrentFiles(updatedFiles);
    setIsCameraOpen(false);
  };

  if (isCameraOpen) {
    return (
      <div className="flex flex-col h-screen">
        <MultiImageCapture
          onCapture={handleCapturedPhotos}
          onClose={() => setIsCameraOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <ParkingOptionsTabs />
          <Card className="w-full ">
            <CardHeader>
              <div className="flex flex-row items-center gap-4">
                <div className="w-5 h-5 fill-foreground">
                  <ParkIconPath />
                </div>
                <CardTitle>Dropoff Vehicle</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <NewDropoffRequestForm
                capturedFiles={currentFiles}
                onOpenCamera={() => setIsCameraOpen(true)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-full bg-white z-1000">
        <NavigationBar />
      </div>
    </div>
  );
}
