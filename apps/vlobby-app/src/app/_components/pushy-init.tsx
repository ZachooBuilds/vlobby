'use client';

import { useEffect } from 'react';
import Pushy from 'pushy-cordova';
import { useMutation } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';

export default function PushyInitializer() {
  const storeDeviceToken = useMutation(api.pushNotifications.storeDeviceToken);

  useEffect(() => {
    // Initialize Pushy
    Pushy.listen();

    // Register device for push notifications
    Pushy.register(async (err: any, deviceToken: any) => {
      if (err) {
        console.error('Pushy registration error:', err);
        return;
      }
      console.log('Pushy device token:', deviceToken);
      
      // Send deviceToken to your Convex backend
      try {
        await storeDeviceToken({ deviceToken });
        console.log('Device token stored successfully');
      } catch (error) {
        console.error('Failed to store device token:', error);
      }
    });

    // Listen for push notifications
    Pushy.setNotificationListener((data: any) => {
      console.log('Received notification:', data);
      // Handle the notification data
    });

    // Optional: Listen for notification clicks
    Pushy.setNotificationClickListener((data: any) => {
      console.log('Notification clicked:', data);
      // Handle notification click
    });
  }, [storeDeviceToken]);

  return null;
}
