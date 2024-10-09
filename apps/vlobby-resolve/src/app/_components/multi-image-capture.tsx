import React, { useState, useRef } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '@repo/ui/components/ui/button';
import { CameraIcon, XIcon, CheckIcon } from 'lucide-react';

interface MultiPhotoCaptureProps {
  onCapture: (files: File[]) => void;
}

const MultiPhotoCapture = ({ onCapture }: MultiPhotoCaptureProps) => {
  const [capturedPhotos, setCapturedPhotos] = useState<File[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openCamera = async () => {
    // ... existing code to open camera ...
    setIsCameraOpen(true);
  };

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

  const removePhoto = (index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const finishCapture = () => {
    setIsCameraOpen(false);
    onCapture(capturedPhotos);
  };

  if (!isCameraOpen) {
    return (
      <Button onClick={openCamera} variant="outline" className="w-full" type="button">
        <CameraIcon className="mr-2 h-4 w-4" />
        Open Camera
      </Button>
    );
  }

  return (
    <div className="relative h-full w-full">
      <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        <Button onClick={capturePhoto} variant="outline" className="rounded-full p-2">
          <CameraIcon className="h-6 w-6" />
        </Button>
        <Button onClick={finishCapture} variant="outline" className="rounded-full p-2">
          <CheckIcon className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
        {capturedPhotos.map((photo, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(photo)}
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
