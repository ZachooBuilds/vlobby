'use client';

import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '@repo/ui/components/ui/drawer';
import { Button } from '@repo/ui/components/ui/button';
import useDrawerStore from '../../lib/global-state';

export function GlobalDrawer() {
  const { isOpen, title, description, content, closeDrawer } = useDrawerStore();

  return (
    <Drawer open={isOpen} onOpenChange={closeDrawer}>
      <DrawerContent className="h-fit max-h-[90vh] pb-10">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-auto">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}
