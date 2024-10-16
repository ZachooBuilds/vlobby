/**
 * @page.tsx Access Control Page
 * This file contains the AccessPage component for the maintenance access control section.
 */

'use client';
import React from 'react';
import NavigationBarMaintenance from '../../_components/navigation-maintenance';
import UnderConstructionMessage from '../../_components/under-construction';
import { LockIconPath } from '../../../../public/svg/icons';
import { CardHeader, CardTitle } from '@repo/ui/components/ui/card';

/**
 * @component AccessPage
 * Renders the access control page for the maintenance section.
 * Currently displays an "under construction" message.
 */
export default function AccessPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-5 h-5 fill-foreground">
                <LockIconPath />
              </div>
              Access Control
            </CardTitle>
          </CardHeader>
          <UnderConstructionMessage />
        </div>
      </div>
      <NavigationBarMaintenance />
    </div>
  );
}
