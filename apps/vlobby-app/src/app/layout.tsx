'use client';
import '@repo/ui/globals.css';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import ConvexClientProvider from './ConvexClientProvider';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from '@repo/ui/components/ui/toaster';
import { GlobalDrawer } from './_components/global-drawer';
import { useConvexAuth } from 'convex/react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from './_components/loading spinner';
import { useOrganization, useUser } from '@clerk/clerk-react';

/**
 * RootLayout Component
 *
 * This component serves as the main layout wrapper for the entire application.
 * It sets up the HTML structure, applies global styles, and provides theme and state management.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to be rendered within the layout
 * @returns {JSX.Element} The rendered root layout
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isLoading && isOrgLoaded && isUserLoaded) {
      if (!isAuthenticated || !user) {
        // Redirect to login page if not authenticated
        router.push('/sign-in');
      } else if (!organization) {
        // Redirect to organization creation/selection page if no org is selected
        router.push('/select-org');
      } else {
        setAuthChecked(true);
      }
    }
  }, [isAuthenticated, isLoading, router, organization, isOrgLoaded, isUserLoaded, user]);

  if (isLoading || !isOrgLoaded || !isUserLoaded || !authChecked) {
    return <LoadingSpinner />;
  }

  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${GeistSans.variable}`}
    >
      <body className="h-screen w-screen overflow-hidden">
        <div className="flex h-full w-full flex-col bg-background">
          {/* ThemeProvider: Manages the application's theme */}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {/* ConvexClientProvider: Wraps the app with Convex client for real-time data and authentication */}
            <ConvexClientProvider>
              {children}
              <GlobalDrawer />
            </ConvexClientProvider>
            {/* Toaster: Provides a container for toast notifications */}
            <Toaster />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
