import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { CameraIcon, XIcon, CheckIcon } from 'lucide-react';
import {
  CameraPreview,
  CameraPreviewOptions,
} from '@capacitor-community/camera-preview';

// Define the props interface for the component
interface MultiPhotoCaptureProps {
  onCapture: (files: File[]) => void;
}

const MultiPhotoCapture = ({ onCapture }: MultiPhotoCaptureProps) => {
  // State to store captured photos as base64 strings
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  // State to track if the camera is open
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Effect to clean up camera preview when component unmounts
  useEffect(() => {
    return () => {
      if (isCameraOpen) {
        CameraPreview.stop();
      }
    };
  }, [isCameraOpen]);

  // Function to open the camera preview
  const openCamera = async () => {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview',
      disableAudio: true,
      width: window.screen.width,
      height: window.screen.height,
      toBack: true,
      paddingBottom: 0,
      rotateWhenOrientationChanged: true,
    };

    try {
      await CameraPreview.start(cameraPreviewOptions);
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error opening camera:', error);
    }
  };

  // Function to capture a photo
  const capturePhoto = async () => {
    try {
      const result = await CameraPreview.capture({
        quality: 90,
      });
      if (result.value) {
        setCapturedPhotos((prev) => [
          ...prev,
          `data:image/jpeg;base64,${result.value}`,
        ]);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  // Function to remove a photo from the captured photos array
  const removePhoto = (index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to finish capturing and process the photos
  const finishCapture = async () => {
    await CameraPreview.stop();
    setIsCameraOpen(false);
    // Convert base64 strings to File objects
    const files = await Promise.all(
      capturedPhotos.map(async (dataUrl, index) => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], `photo_${index}.jpg`, { type: 'image/jpeg' });
      })
    );
    onCapture(files);
  };

  // Render the "Open Camera" button when the camera is not open
  if (!isCameraOpen) {
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
  }

  // Render the camera preview and controls when the camera is open
  return (
    <div className="relative h-full w-full" id="cameraPreview">
      {/* Camera controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 z-10">
        <Button
          onClick={capturePhoto}
          variant="outline"
          className="rounded-full p-2"
        >
          <CameraIcon className="h-6 w-6" />
        </Button>
        <Button
          onClick={finishCapture}
          variant="outline"
          className="rounded-full p-2"
        >
          <CheckIcon className="h-6 w-6" />
        </Button>
      </div>
      {/* Thumbnail preview of captured photos */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-10">
        {capturedPhotos.map((photo, index) => (
          <div key={index} className="relative">
            <img
              src={photo}
              alt={`Captured ${index}`}
              className="h-16 w-16 rounded-md object-cover"
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1"
            >
              <XIcon className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiPhotoCapture;
