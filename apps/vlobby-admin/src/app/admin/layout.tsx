'use client';
import { useConvexAuth } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';
import WebNavigation from './_components/navigation-components/navigationMenu';
import PageBar from './_components/navigation-components/page-bar';
import { GlobalSheet } from './_components/global-components/global-sheet';
import { GlobalModal } from './_components/global-components/global-modal';

/**
 * AdminLayout component
 *
 * This component handles the layout for the admin section of the application.
 * It manages authentication state and renders appropriate UI based on that state.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to be rendered within the layout
 * @returns {JSX.Element} The rendered AdminLayout component
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  // Display loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="text-md ml-10 animate-pulse font-normal">
          Fetching account data ...
        </span>
      </div>
    );
  }

  // Display sign out message if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="text-md ml-10 animate-pulse font-medium">
          Signing you out ...
        </span>
      </div>
    );
  }

  // Render the main admin layout if user is authenticated
  return (
    <div className="flex h-full w-full flex-row gap-2">
      <WebNavigation />
      <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
        <PageBar />
        <main className="flex-1 overflow-scroll p-2 bg-muted rounded-md">
          {children}
        </main>
        <GlobalSheet />
        <GlobalModal />
      </div>
    </div>
  );
}
