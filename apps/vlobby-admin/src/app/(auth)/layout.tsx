'use client';

import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * AuthLayout Component
 *
 * This component serves as the layout for authentication-related pages.
 * It provides a responsive grid layout with an image and a main content area.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout
 * @returns {JSX.Element} The rendered authentication layout
 */
export default function AuthLayout({ children }: React.PropsWithChildren) {
  // const router = useRouter();

  // useEffect(() => {
  //   // Force a page reload on mount
  //   router.refresh();
  // }, []);

  return (
    <div className="flex flex-row h-full gap-4">
      {/* AspectRatio: Maintains a 16:9 aspect ratio for the image container */}
      <AspectRatio ratio={16 / 9}>
        <Image
          src="https://cdn.wallpapersafari.com/49/5/uDB8mW.jpeg"
          alt="A cool pic of a helicopter"
          fill
          className="absolute inset-0 h-full rounded-md object-cover"
          priority
        />
      </AspectRatio>
      {/* Main content area: Responsive positioning and sizing for the authentication form */}
      <main className=" container absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
        {children}
      </main>
    </div>
  );
}
