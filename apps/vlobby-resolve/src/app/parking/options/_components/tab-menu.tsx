import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@repo/ui/lib/utils';

export default function ParkingOptionsTabs() {
  const pathname = usePathname();

  return (
    <div className="grid w-full grid-cols-2 h-14">
      <Link
        href="/parking/options/search"
        className={cn(
          'flex items-center justify-center h-full rounded-md',
          pathname === '/parking/options/search'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        Request Vehicle
      </Link>
      <Link
        href="/parking/options/dropoff"
        className={cn(
          'flex items-center justify-center h-full rounded-md',
          pathname === '/parking/options/dropoff'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        Dropoff Vehicle
      </Link>
    </div>
  );
}
