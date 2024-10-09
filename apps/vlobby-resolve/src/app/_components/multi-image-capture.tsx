import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '@repo/ui/components/ui/button';
import { CameraIcon } from 'lucide-react';

interface MultiPhotoCaptureProps {
  onCapture: (files: File[]) => void;
}

const MultiPhotoCapture = ({ onCapture }: MultiPhotoCaptureProps) => {
  const [capturedPhotos, setCapturedPhotos] = useState<File[]>([]);

  const capturePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      if (image.webPath) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], `photo_${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });

        setCapturedPhotos((prev) => [...prev, file]);
        onCapture([file]);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={capturePhoto}
        variant="outline"
        className="w-full"
        type="button"
      >
        <CameraIcon className="mr-2 h-4 w-4" />
        Take Photo
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
