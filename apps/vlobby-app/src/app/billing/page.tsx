'use client';

import React from 'react';
import NavigationBar from '../_components/navigation';
import { BillingIconPath } from '../../../public/svg/icons';
import UnderConstructionMessage from '../_components/under-construction';

export default function BillingPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <div className="flex flex-row items-center gap-2">
            <div className="w-5 h-5 fill-foreground">
              <BillingIconPath />
            </div>
            <h2 className="text-xl font-semibold">Billing</h2>
          </div>
          <div className="flex pt-20 flex-col items-center justify-center gap-4">
            <UnderConstructionMessage
              badgeText="Coming Soon"
              title="Billing Feature"
              description="We're working on bringing you an advanced billing system. Stay tuned for easy payments and invoicing!"
            />
          </div>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
