'use client';

import React from 'react';
import NavigationBar from '../_components/navigation';
import { SettingIconPath } from '../../../public/svg/icons';
import { SignOutButton } from '../(auth)/_components/sign-out-button';

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4 items-start justify-start pt-16 p-4 pb-[120px] w-full">
          <div className="flex flex-row items-center gap-2">
            <div className="w-5 h-5 fill-foreground">
              <SettingIconPath />
            </div>
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <p>Settings page content goes here</p>
          <SignOutButton />
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
