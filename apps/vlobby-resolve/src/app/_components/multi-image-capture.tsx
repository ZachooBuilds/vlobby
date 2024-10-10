import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { CameraIcon, FlipVertical } from 'lucide-react';
import {
  CameraPreview,
  CameraPreviewOptions,
} from '@capacitor-community/camera-preview';

interface MultiPhotoCaptureProps {
  onCapture: (files: File[]) => void;
}

const MultiPhotoCapture = ({ onCapture }: MultiPhotoCaptureProps) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      CameraPreview.stop();
    };
  }, []);

  const openCamera = async () => {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'divCameraPreviewContent',
      className: 'camera-preview',
      disableAudio: true,
      width: window.innerWidth,
      height: window.innerHeight,
      toBack: true, // Changed from true to false
    };

    try {
      setIsCameraOpen(true); // Set this to true before starting the camera
      // Wait for the next render cycle to ensure the cameraPreview element exists
      setTimeout(async () => {
        await CameraPreview.start(cameraPreviewOptions);
      }, 0);
    } catch (error) {
      console.error('Error opening camera:', error);
      setIsCameraOpen(false); // Reset if there's an error
    }
  };

  const capturePhoto = async () => {
    try {
      console.log('button clicked to capture');
      const result = await CameraPreview.capture({ quality: 90 });
      if (result.value) {
        const dataUrl = `data:image/jpeg;base64,${result.value}`;
        setCapturedPhotos((prev) => [...prev, dataUrl]);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const flipCamera = async () => {
    try {
      await CameraPreview.flip();
    } catch (error) {
      console.error('Error flipping camera:', error);
    }
  };

  const closeCamera = async () => {
    await CameraPreview.stop();
    setIsCameraOpen(false);
  };

  const finishCapture = () => {
    const files = capturedPhotos.map((dataUrl, index) => {
      const [, base64] = dataUrl.split(',');
      const byteCharacters = atob(base64 || '');
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      return new File([blob], `photo_${index + 1}.jpg`, { type: 'image/jpeg' });
    });
    onCapture(files);
    closeCamera();
  };

  if (isCameraOpen) {
    return (
      <div className="flex flex-col h-full w-full relative" id="cameraPreview">
        <div className="flex flex-row justify-between z-10 p-4">
          <Button
            onClick={flipCamera}
            variant="outline"
            className="rounded-full p-2"
            type="button"
          >
            <FlipVertical className="h-6 w-6" />
          </Button>
          <Button
            onClick={finishCapture}
            variant="outline"
            className="rounded-full p-2"
            type="button"
          >
            Finish
          </Button>
        </div>
        <div className="flex-grow"></div>
        <div className="flex flex-col items-center z-10 p-4">
          <Button
            onClick={capturePhoto}
            variant="outline"
            className="rounded-full p-2 mb-4"
            type="button"
          >
            <CameraIcon className="h-6 w-6" />
          </Button>
          <div className="flex flex-row overflow-x-auto w-full">
            {capturedPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Captured ${index + 1}`}
                className="h-16 w-16 object-cover mr-2 rounded"
              />
            ))}
          </div>
        </div>
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
