'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DashboardIconPath,
  HomeIconPath,
  SettingIconPath,
  NoticesIconPath,
  ParcelIconPath,
  HammerIconPath,
  CommunicationIconPath,
  ParkIconPath,
  FacilityIconPath,
  EventIconPath,
  OffersIconPath,
  BillingIconPath,
} from '../../../public/svg/icons';

const navigationItems = [
  { name: 'Social', href: '/social', icon: NoticesIconPath },
  { name: 'Home', href: '/home', icon: DashboardIconPath },
  { name: 'Settings', href: '/settings', icon: SettingIconPath },
];

const additionalOptions = [
  { name: 'Parcels', icon: ParcelIconPath, href: '/parcels' },
  { name: 'Maintainence', icon: HammerIconPath, href: '/maintenance' },
  { name: 'Messages', icon: CommunicationIconPath, href: '/messages' },
  { name: 'Vehicles', icon: ParkIconPath, href: '/vehicles' },
  { name: 'Facilities', icon: FacilityIconPath, href: '/facilities' },
  { name: 'Events', icon: EventIconPath, href: '/events' },
  { name: 'Offers', icon: OffersIconPath, href: '/offers' },
  { name: 'Home', icon: HomeIconPath, href: '/home' },
  { name: 'Billing', icon: BillingIconPath, href: '/billing' },
];

export default function NavigationBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleItemClick = (href: string) => {
    setIsExpanded(false);
    router.push(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg shadow-black/10 bg-background border-t border-muted overflow-hidden">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="grid grid-cols-3 gap-4 p-4"
          >
            {additionalOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex flex-col items-center justify-center p-2"
                onClick={() => handleItemClick(option.href)}
              >
                <div className="w-8 h-8 fill-muted-foreground">
                  {option.icon()}
                </div>
                <span className="text-xs mt-1">{option.name}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-row justify-around items-center p-2">
        {navigationItems.map((item) => (
          <div
            key={item.name}
            className={`p-4 ${pathname === item.href ? 'bg-muted' : ''}`}
            onClick={() => {
              if (item.name === 'Home') {
                setIsExpanded(!isExpanded);
              } else {
                handleItemClick(item.href);
              }
            }}
          >
            <div className="w-8 h-8 fill-muted-foreground">{item.icon()}</div>
          </div>
        ))}
      </div>
    </nav>
  );
}
