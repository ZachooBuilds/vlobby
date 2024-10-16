'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@repo/ui/components/ui/button';
import { viewOptions } from '../../lib/staticData';

export default function ViewSwitcher() {
  const pathname = usePathname();

  return (
    <div className="flex flex-row gap-2 w-full">
      {viewOptions.map((option) => (
        <Link key={option.id} href={option.href} passHref className="w-full">
          <Button
            variant={pathname === option.href ? 'default' : 'outline'}
            className={`h-14 px-4 w-full ${
              pathname === option.href
                ? 'bg-primary text-white'
                : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-4 h-4 mr-4 ${pathname === option.href ? 'fill-white' : 'fill-foreground'}`}
            >
              <option.icon />
            </div>
            {option.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
