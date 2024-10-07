'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { useMutation } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { useAuth } from '@clerk/clerk-react';

export default function PushNotificationInitializer() {
  const storeDeviceToken = useMutation(api.pushNotifications.storeDeviceToken);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      console.log('PushNotificationInitializer: User not signed in, exiting');
      return;
    }

    console.log('PushNotificationInitializer: Effect started');
    if (Capacitor.getPlatform() !== 'ios' && Capacitor.getPlatform() !== 'android') {
      console.log('PushNotificationInitializer: Not a mobile platform, exiting');
      return;
    }

    const initializePushNotifications = async () => {
      console.log('PushNotificationInitializer: Initializing push notifications');
      try {
        // Request permission to use push notifications
        // iOS will prompt user and return if they granted permission or not
        // Android will just grant without prompting
        const result = await PushNotifications.requestPermissions();
        console.log('PushNotificationInitializer: Permission request result:', result);
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          await PushNotifications.register();
          console.log('PushNotificationInitializer: Registration complete');
        } else {
          console.log('PushNotificationInitializer: Push notification permission denied');
        }
      } catch (error) {
        console.error('PushNotificationInitializer: Error in initialization:', error);
      }
    };

    initializePushNotifications();

    // Add listeners for push notifications
    PushNotifications.addListener('registration', async (token) => {
      console.log('PushNotificationInitializer: Push registration success, token:', token.value);
      try {
        await storeDeviceToken({ deviceToken: token.value });
        console.log('PushNotificationInitializer: Device token stored successfully');
      } catch (error) {
        console.error('PushNotificationInitializer: Error storing device token:', error);
      }
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed:', notification);
    });

    return () => {
      console.log('PushNotificationInitializer: Cleaning up listeners');
      PushNotifications.removeAllListeners();
    };
  }, [isSignedIn, storeDeviceToken]);

  // This component doesn't render anything visible
  return null;
}
