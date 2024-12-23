'use client';
import '@repo/ui/globals.css';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import ConvexClientProvider from './ConvexClientProvider';
import { ReactNode, useEffect } from 'react';
import { Toaster } from '@repo/ui/components/ui/toaster';
import { GlobalDrawer } from './_components/global-drawer';
import { AuthCheck } from './_components/validate-auth';
import PushNotificationInitializer from './_components/PushNotificationInitializer';
import { Camera } from '@capacitor/camera';

/**
 * RootLayout Components
 *
 * This component serves as the main layout wrapper for the entire application.
 * It sets up the HTML structure, applies global styles, and provides theme and state management.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to be rendered within the layout
 * @returns {JSX.Element} The rendered root layout
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    Camera.requestPermissions();
  }, []);

  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${GeistSans.variable}`}
    >
      <body className="h-screen w-screen overflow-hidden">
        <div className="flex h-full w-full flex-col bg-background">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <AuthCheck>
                <PushNotificationInitializer />
                {children}
                <GlobalDrawer />
              </AuthCheck>
            </ConvexClientProvider>
            <Toaster />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
