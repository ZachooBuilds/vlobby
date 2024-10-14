'use client';
import { ReactNode, useEffect, useState } from 'react';
import {
  useUser,
  useOrganizationList,
  useOrganization,
  useClerk,
} from '@clerk/clerk-react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Array of routes that are accessible without authentication.
 */
const publicRoutes = ['/sign-in', '/sign-up', '/'];

/**
 * AuthCheck Component
 *
 * This component handles authentication and authorization checks for the application.
 * It ensures that users are properly authenticated and have the necessary permissions
 * to access certain routes. It also manages organization selection for authenticated users.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The child components to render if authentication passes
 * @returns {JSX.Element} The authenticated content or a loading spinner
 */
export function AuthCheck({ children }: { children: ReactNode }) {
  // Get the current user details from clerk
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();

  // Get the current organization from clerk
  const { organization } = useOrganization();

  // Get the current user memberships from clerk
  const {
    setActive,
    userMemberships,
    isLoaded: membershipsLoaded,
  } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const clerk = useClerk();

  /**
   * Effect hook to perform authentication checks
   *
   * This effect runs when the authentication state changes. It handles:
   * - Redirecting authenticated users from public routes
   * - Redirecting unauthenticated users to the sign-in page
   * - Setting the active organization for authenticated users
   */
  useEffect(() => {
    const checkAuth = async () => {
      if (publicRoutes.includes(pathname)) {
        if (
          user &&
          (pathname === '/sign-in' ||
            pathname === '/sign-up' ||
            pathname === '/')
        ) {
          router.push('/maintenance');
          return;
        }
        setAuthChecked(true);
        return;
      }

      if (!isSignedIn || !user) {
        router.push('/sign-in');
        return;
      }

      if (userMemberships?.data && !organization) {
        if (setActive && user.organizationMemberships[0]) {
          try {
            await setActive({
              organization: user.organizationMemberships[0].organization.id,
            });
            setAuthChecked(true);
          } catch (error) {
            console.error('Error setting active organization:', error);
            router.push('/sign-up');
          }
        } else {
          router.push('/sign-up');
        }
      } else {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [isSignedIn, user]);

  /**
   * Effect hook to handle user data reloading
   *
   * This effect sets up an event listener for visibility changes.
   * When the page becomes visible, it reloads the user data to ensure it's up-to-date.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        clerk.user?.reload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clerk]);

  /**
   * Render loading spinner if organization is not yet loaded
   */
  if (!authChecked) {
    return;
  }

  return <>{children}</>;
}
