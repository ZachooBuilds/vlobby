'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import ViewSwitcher from '../_components/view-switcher';
import NavigationBarMaintenance from '../_components/navigation-maintenance';
import UnderConstructionMessage from '../_components/under-construction';

export default function SettingsPage() {

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <div className="w-full mb-4 w-full">
            <ViewSwitcher />
          </div>
          <UnderConstructionMessage />
        </div>
      </div>
      <NavigationBarMaintenance />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
