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
} from '../../../public/svg/icons';

const navigationItems = [
  { name: 'Dashboard', href: '/parking', icon: DashboardIconPath },
  { name: 'Requests', href: '/parking/requests', icon: ParkIconPath },
  { name: 'Options', href: '/parking/options/search', icon: CarIconPath },
  { name: 'Map', href: '/parking/map', icon: MapIconPath },
];

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="z-1000 fixed bottom-6 left-4 right-4 shadow-lg rounded shadow-foreground-muted/10 bg-background border-muted overflow-hidden">
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
