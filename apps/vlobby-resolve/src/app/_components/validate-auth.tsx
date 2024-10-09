'use client';
import { useEffect, useState } from 'react';
import {
  useUser,
  useOrganizationList,
  useOrganization,
} from '@clerk/clerk-react';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinner } from './loading spinner';

const publicRoutes = ['/sign-in', '/sign-up', '/'];

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const {
    setActive,
    userMemberships,
    isLoaded: membershipsLoaded,
  } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const { organization, isLoaded: orgLoaded } = useOrganization();

  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    
    const checkAuth = async () => {
      if (publicRoutes.includes(pathname)) {
        if (user && (pathname === '/sign-in' || pathname === '/sign-up')) {
          router.push('/maintenance');
          return;
        }
        setAuthChecked(true);
        return;
      }

      if (!user) {
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
  }, [
    user,
    userMemberships,
    setActive,
    pathname,
    organization,
    userLoaded,
    membershipsLoaded,
    orgLoaded,
    router,
  ]);

  if (!authChecked) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
