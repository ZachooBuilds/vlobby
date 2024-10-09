'use client';
import { useEffect, useState } from 'react';
import {
  useUser,
  useOrganizationList,
  useOrganization,
} from '@clerk/clerk-react';
import { useRouter, usePathname } from 'next/navigation';
import { LoadingSpinner } from './loading spinner';

const publicRoutes = ['/sign-in', '/sign-up', '/'];

export function AuthCheck({ children }: { children: React.ReactNode }) {
  console.log('[AuthCheck] Component rendered');
  const { user } = useUser();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const org = useOrganization();

  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  console.log('[AuthCheck] Initial state:', { user, pathname, authChecked });

  useEffect(() => {
    console.log('[AuthCheck] useEffect triggered');

    if (publicRoutes.includes(pathname)) {
      console.log('[AuthCheck] Public route detected:', pathname);
      if (user && (pathname === '/sign-in' || pathname === '/sign-up')) {
        console.log(
          '[AuthCheck] User logged in on auth route, redirecting to home'
        );
        router.push('/home');
        return;
      }
      setAuthChecked(true);
      return;
    }

    if (!user) {
      console.log('[AuthCheck] No user found, redirecting to sign-in');
      router.push('/sign-in');
    } else if (user && userMemberships && userMemberships.data) {
      console.log('[AuthCheck] User and memberships data available:', {
        user,
        memberships: userMemberships.data,
      });
      if (!org.organization) {
        if (setActive && user.organizationMemberships[0]) {
          console.log('[AuthCheck] Attempting to set active organization');
          setActive({
            organization: user.organizationMemberships[0]!.organization.id,
          })
            .then(() => {
              console.log('[AuthCheck] Active organization set successfully');
              setAuthChecked(true);
            })
            .catch((error: unknown) => {
              console.error(
                '[AuthCheck] Error setting active organization:',
                error
              );
              router.push('/sign-up');
            });
        } else {
          console.log(
            '[AuthCheck] No organization memberships, redirecting to sign-up'
          );
          router.push('/sign-up');
        }
      } else {
        console.log(
          '[AuthCheck] Organization already set, setting authChecked to true'
        );
        setAuthChecked(true);
      }
    } else {
      console.log(
        '[AuthCheck] No user memberships data, setting authChecked to true'
      );
      setAuthChecked(true);
    }
  }, [router, user, userMemberships, setActive, pathname, org.organization]);

  if (!authChecked) {
    console.log(
      '[AuthCheck] Auth check not complete, displaying loading spinner'
    );
    return <LoadingSpinner />;
  }

  console.log('[AuthCheck] Auth check passed, rendering children');
  return <>{children}</>;
}
