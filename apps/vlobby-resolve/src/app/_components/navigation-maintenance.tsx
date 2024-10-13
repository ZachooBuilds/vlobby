'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardIconPath,
  HomeIconPath,
  SettingIconPath,
  NoticesIconPath,
  ParkIconPath,
  CarIconPath,
  MapIconPath,
  TicketIconPath,
  LockIconPath,
} from '../../../public/svg/icons';

const navigationItems = [
  { name: 'Dashboard', href: '/maintenance', icon: DashboardIconPath },
  { name: 'Issues', href: '/maintenance/issues', icon: TicketIconPath },
  { name: 'Access', href: '/maintenance/access', icon: LockIconPath },
  { name: 'Settings', href: '/settings', icon: SettingIconPath },
];

export default function NavigationBarMaintenance() {
  const pathname = usePathname();

  return (
    <nav className="z-100 fixed bottom-6 left-4 right-4 shadow-lg rounded-md shadow-foreground-muted/10 bg-background border-muted overflow-hidden">
      <div className="flex flex-row justify-around items-center p-2 bg-background">
        {navigationItems.map((item) => (
          <Link key={item.name} href={item.href} passHref>
            <div className="p-4">
              <div
                className={`w-8 h-8 ${pathname === item.href ? 'fill-primary' : 'fill-foreground'}`}
              >
                {item.icon()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
