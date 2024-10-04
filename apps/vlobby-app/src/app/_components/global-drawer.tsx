'use client';

import React, { useRef, useEffect } from 'react';
import '@ionic/react/css/core.css';
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
import { IonContent } from '@ionic/react';

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
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    const adjustScroll = () => {
      if (contentRef.current) {
        contentRef.current.scrollToTop(300);
      }
    };

    window.addEventListener('ionKeyboardDidShow', adjustScroll);
    return () => {
      window.removeEventListener('ionKeyboardDidShow', adjustScroll);
    };
  }, []);

  return (
    <Drawer open={isOpen} onOpenChange={closeDrawer}>
      <DrawerContent className="h-[80vh] flex flex-col">
        <IonContent
          ref={contentRef}
          scrollY={true}
          className="flex-grow overflow-auto"
          style={{ '--overflow': 'hidden' }}
        >
          <div className="p-4 space-y-4">
            <DrawerHeader className="p-0">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div>{content}</div>
          </div>
        </IonContent>
        <DrawerFooter className="flex-shrink-0">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
