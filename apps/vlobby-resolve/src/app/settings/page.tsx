'use client';
import React from 'react';
import { SettingIconPath } from '../../../public/svg/icons';
import { SignOutButton } from '../(auth)/_components/sign-out-button';
import { ModeToggle } from '../_components/dark-mode-toggle';
import NavigationBarMaintenance from '../_components/navigation-maintenance';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { useUser } from '@clerk/clerk-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/ui/avatar';

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
          <UserOverview />
          <ThemeOverview />
        </div>
      </div>
      <NavigationBarMaintenance />
    </div>
  );
}

function UserOverview() {
  const user = useUser();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user.user?.imageUrl}
                alt={user.user?.fullName || ''}
              />
              <AvatarFallback>
                {user.user?.firstName?.[0]}
                {user.user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-semibold">{user.user?.fullName}</h3>
              <p className="text-sm text-muted-foreground">
                {user.user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <SignOutButton />
      </CardFooter>
    </Card>
  );
}

function ThemeOverview() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Theme Preference</CardTitle>
      </CardHeader>
      <CardContent>
        <ModeToggle />
      </CardContent>
    </Card>
  );
}
