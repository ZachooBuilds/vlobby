import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { CameraIcon, FlipVertical, X } from 'lucide-react';
import {
  CameraPreview,
  CameraPreviewOptions,
} from '@capacitor-community/camera-preview';

interface MultiPhotoCaptureProps {
  onCapture: (files: File[]) => void;
  onClose: () => void;
}

const MultiPhotoCapture = ({ onCapture, onClose }: MultiPhotoCaptureProps) => {
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const initCamera = async () => {
      try {
        await openCamera();
      } catch (error) {
        console.error('Failed to initialize camera:', error);
        if (isMounted) onClose();
      }
    };

    initCamera();

    return () => {
      isMounted = false;
      CameraPreview.stop().catch((error) =>
        console.error('Error stopping camera on unmount:', error)
      );
    };
  }, []);

  const openCamera = async () => {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'camera-preview',
      disableAudio: true,
      width: window.innerWidth,
      height: window.innerHeight,
      toBack: true,
    };

    try {
      await CameraPreview.start(cameraPreviewOptions);
    } catch (error) {
      console.error('Error opening camera:', error);
      onClose();
    }
  };

  const capturePhoto = async () => {
    try {
      console.log('button clicked to capture');
      const result = await CameraPreview.capture({ quality: 70 });
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
    onClose();
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

  return (
    <div className="fixed inset-0 z-50 h-full" id="cameraPreview">
      <div className="absolute top-10 left-4 right-4 flex justify-between p-4 z-10">
        <Button
          onClick={closeCamera}
          variant="outline"
          className="rounded-full p-2"
          type="button"
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          onClick={flipCamera}
          variant="outline"
          className="rounded-full p-2"
          type="button"
        >
          <FlipVertical className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute bottom-120 left-0 right-0 p-4 z-10">
        <div className="flex justify-center mb-4">
          <Button
            onClick={capturePhoto}
            variant="outline"
            className="rounded-full p-4"
            type="button"
          >
            <CameraIcon className="h-8 w-8" />
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex-1 overflow-x-auto whitespace-nowrap">
            {capturedPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Captured ${index + 1}`}
                className="h-16 w-16 object-cover inline-block mr-2 rounded"
              />
            ))}
          </div>
          {capturedPhotos.length > 0 && (
            <Button
              onClick={finishCapture}
              variant="outline"
              className="ml-4"
              type="button"
            >
              Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiPhotoCapture;
