'use client';
import '@repo/ui/globals.css';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import ConvexClientProvider from './ConvexClientProvider';
import { ReactNode } from 'react';
import { Toaster } from '@repo/ui/components/ui/toaster';
import { GlobalDrawer } from './_components/global-drawer';

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
