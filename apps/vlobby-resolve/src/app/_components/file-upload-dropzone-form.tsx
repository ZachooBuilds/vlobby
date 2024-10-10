'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { cn } from '@repo/ui/lib/utils';
import { UploadCloudIcon } from 'lucide-react';
import MultiPhotoCapture from './multi-image-capture';

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUploadForm = ({
  onChange,
  files,
}: {
  onChange: (files: File[]) => void;
  files: File[];
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    onChange(newFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true, // Allow multiple file selection
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
    accept: {
      'image/*': [],
      'application/pdf': ['.pdf'],
    }, // Accept only images and PDFs
  });

  const handleCapturePhotos = (capturedFiles: File[]) => {
    onChange(capturedFiles);
  };

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files ?? []))}
          className="hidden"
          multiple // Allow multiple file selection
          accept="image/*,.pdf" // Accept only images and PDFs
          // Add the key prop to force re-render
          key={files.length}
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative mx-auto mt-10 w-full max-w-xl">
            <motion.div
              layoutId="file-upload"
              variants={mainVariant}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
              className={cn(
                'relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-muted group-hover/file:shadow-2xl ',
                'shadow-[0px_10px_50px_rgba(0,0,0,0.1)]'
              )}
            >
              {isDragActive ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-foreground"
                >
                  Drop it
                  <UploadCloudIcon className="h-4 w-4 text-primary " />
                </motion.p>
              ) : (
                <UploadCloudIcon className="h-4 w-4 text-primary " />
              )}
            </motion.div>

            <motion.div
              variants={secondaryVariant}
              className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-primary bg-transparent opacity-0"
            ></motion.div>
          </div>
        </div>
      </motion.div>
      {/* <MultiPhotoCapture onCapture={handleCapturePhotos} /> */}
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex flex-shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-muted">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex h-10 w-10 flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? 'bg-background'
                  : 'bg-background shadow-[0px_0px_1px_3px_theme(colors.background/30%)_inset] dark:shadow-[0px_0px_1px_3px_theme(colors.background/30%)_inset]'
              }`}
            />
          );
        })
      )}
    </div>
  );
}
