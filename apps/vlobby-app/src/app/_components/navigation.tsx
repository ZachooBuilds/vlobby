'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  const handleItemClick = () => {
    setIsExpanded(false);
  };

  return (
    <nav className="fixed bottom-6 left-4 right-4 shadow-lg rounded rounded-md shadow-foreground-muted/10 bg-background border-muted overflow-hidden">
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
              <Link key={option.name} href={option.href} passHref>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex flex-col items-center justify-center p-2"
                  onClick={handleItemClick}
                >
                  <div className="w-8 h-8 fill-muted-foreground">
                    {option.icon()}
                  </div>
                  <span className="text-xs mt-1">{option.name}</span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-row justify-around items-center p-2 bg-background">
        {navigationItems.map((item) => (
          <div
            key={item.name}
            className="p-4"
            onClick={() => {
              if (item.name === 'Home') {
                setIsExpanded(!isExpanded);
              } else {
                handleItemClick();
              }
            }}
          >
            {item.name === 'Home' ? (
              <div className="w-8 h-8 fill-primary">
                {item.icon()}
              </div>
            ) : (
              <Link href={item.href} passHref>
                <div className="w-8 h-8 fill-foreground">
                  {item.icon()}
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
