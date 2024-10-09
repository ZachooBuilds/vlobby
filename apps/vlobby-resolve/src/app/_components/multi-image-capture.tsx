import React, { useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { CameraIcon } from 'lucide-react';
import {
  CameraPreview,
  CameraPreviewOptions,
} from '@capacitor-community/camera-preview';

interface MultiPhotoCaptureProps {
  onCapture: (files: File[]) => void;
}

const MultiPhotoCapture = ({ onCapture }: MultiPhotoCaptureProps) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const openCamera = async () => {
    const cameraPreviewOptions: CameraPreviewOptions = {
      // ... existing camera options ...
    };

    try {
      await CameraPreview.start(cameraPreviewOptions);
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error opening camera:', error);
    }
  };

  const capturePhotos = async () => {
    try {
      const result = await CameraPreview.capture({ quality: 90 });
      if (result.value) {
        const dataUrl = `data:image/jpeg;base64,${result.value}`;
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        onCapture([file]);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    } finally {
      await CameraPreview.stop();
      setIsCameraOpen(false);
    }
  };

  if (isCameraOpen) {
    return (
      <div className="relative h-full w-full" id="cameraPreview">
        <Button
          onClick={capturePhotos}
          variant="outline"
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 rounded-full p-2"
        >
          <CameraIcon className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={openCamera}
      variant="outline"
      className="w-full"
      type="button"
    >
      <CameraIcon className="mr-2 h-4 w-4" />
      Open Camera
    </Button>
  );
};

export default MultiPhotoCapture;
