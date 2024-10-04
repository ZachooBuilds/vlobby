'use client';

import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@repo/ui/components/ui/drawer';
import { Button } from '@repo/ui/components/ui/button';
import useDrawerStore from '../../lib/global-state';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';

/**
 * GlobalDrawer Component
 *
 * This component provides a reusable drawer for the application.
 * It uses the useDrawerStore hook to manage the drawer's state and content.
 *
 * @returns {JSX.Element} A drawer component with dynamic content
 */
export function GlobalDrawer() {
  const { isOpen, title, description, content, closeDrawer } = useDrawerStore();

  return (
    <Drawer open={isOpen} onOpenChange={closeDrawer}>
      {/* <DrawerContent className="pb-10 max-h-[80vh] overflow-y-auto"> */}
      <DrawerContent className="pb-10">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="overflow-scroll h-full">
          <div className="px-4 py-2">{content}</div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
