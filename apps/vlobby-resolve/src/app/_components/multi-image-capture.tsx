import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { CameraIcon, XIcon, CheckIcon } from 'lucide-react';

interface MultiPhotoCaptureProps {
  onCapture: (files: File[]) => void;
}

const MultiPhotoCapture = ({ onCapture }: MultiPhotoCaptureProps) => {
  const [capturedPhotos, setCapturedPhotos] = useState<File[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // This requests the back camera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error opening camera:', error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          setCapturedPhotos((prev) => [...prev, file]);
        }
      }, 'image/jpeg');
    }
  };

  const removePhoto = (index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const finishCapture = () => {
    setIsCameraOpen(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
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
