'use client';

import { useEffect } from 'react';
import 'lightbox.js-react/dist/index.css';
import { initLightboxJS, SlideshowLightbox } from 'lightbox.js-react';
import { Badge } from '@tremor/react';

interface PageHeaderProps {
  images?: string[];
}

export default function ImageGalleryComponent({ images }: PageHeaderProps) {
  useEffect(() => {
    initLightboxJS('30EA-8C17-6991-916C', 'Individual');
  }, []);

  return (
    <div>
      {(!images || images.length === 0) && (
        <div className="flex w-full items-end justify-center">
          <Badge color="gray">❌ No Images Uploaded</Badge>
        </div>
      )}
      <SlideshowLightbox
        className="container mx-auto grid grid-cols-3 gap-2"
        showThumbnails={true}
        key={images?.join(',')}
        modalClose="clickOutside"
        showControls={false}
      >
        {images?.map((image, index) => (
          <img
            key={index}
            className="h-full w-full rounded object-cover"
            src={image}
            alt={`Consent image ${index + 1}`}
          />
        ))}
      </SlideshowLightbox>
    </div>
  );
}
