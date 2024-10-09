import React, { useState } from 'react';
import { Camera } from '@capacitor/camera';
import { Button } from '@repo/ui/components/ui/button';
import { CameraIcon } from 'lucide-react';

interface MultiPhotoCaptureProps {
  onCapture: (files: File[]) => void;
}

const MultiPhotoCapture = ({ onCapture }: MultiPhotoCaptureProps) => {
  const [capturedPhotos, setCapturedPhotos] = useState<File[]>([]);

  const capturePhotos = async () => {
    try {
      const images = await Camera.pickImages({
        quality: 50,
        limit: 20, // Adjust this limit as needed
      });

      const newFiles = await Promise.all(
        images.photos.map(async (photo) => {
          const response = await fetch(photo.webPath!);
          const blob = await response.blob();
          return new File([blob], `photo_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
        })
      );

      setCapturedPhotos((prev) => [...prev, ...newFiles]);
      onCapture(newFiles);
    } catch (error) {
      console.error('Error capturing photos:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={capturePhotos}
        variant="outline"
        className="w-full"
        type="button"
      >
        <CameraIcon className="mr-2 h-4 w-4" />
        Capture Photos
      </Button>
      {capturedPhotos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {capturedPhotos.map((photo, index) => (
            <img
              key={index}
              src={URL.createObjectURL(photo)}
              alt={`Captured ${index}`}
              className="h-20 w-20 rounded-md object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiPhotoCapture;
