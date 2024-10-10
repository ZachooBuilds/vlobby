import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonIcon } from '@ionic/react';
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
      parent: 'cameraPreview',
      className: 'cameraPreview',
      disableAudio: true,
      width: window.screen.width,
      height: window.screen.height,
      toBack: true,
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
      <IonContent className="camera-preview-content">
        <div className="relative h-screen w-full" id="cameraPreview">
          <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
            <IonButton
              onClick={flipCamera}
              fill="outline"
              shape="round"
              size="small"
            >
              <FlipVertical />
            </IonButton>
            <IonButton
              onClick={finishCapture}
              fill="outline"
              shape="round"
              size="small"
            >
              Finish
            </IonButton>
          </div>
          <IonButton
            onClick={capturePhoto}
            fill="outline"
            shape="round"
            size="large"
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
          >
            <CameraIcon />
          </IonButton>
          <div className="absolute bottom-4 left-4 right-4 flex overflow-x-auto z-10">
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
      </IonContent>
    );
  }

  return (
    <IonButton onClick={openCamera} fill="outline" expand="block">
      <CameraIcon />
      Open Camera
    </IonButton>
  );
};

export default MultiPhotoCapture;
