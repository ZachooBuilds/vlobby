'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

// to do make reuseable
const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

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
      <div className="flex-grow pt-16 overflow-auto p-4 gap-4 space-y-4">
        <ParkingOptionsTabs />
        <motion.div
          className="flex flex-col gap-4 items-start justify-start pb-[120px] w-full"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={item} className="w-full">
            <Card className="w-full">
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
          </motion.div>
        </motion.div>
      </div>
      <NavigationBar />
    </div>
  );
}
