'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { useAuth } from '@clerk/clerk-react';

export default function PushNotificationInitializer() {
  const storeDeviceToken = useMutation(api.pushNotifications.storeDeviceToken);
  const userToken = useQuery(api.pushNotifications.getUserToken);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      console.log('PushNotificationInitializer: User not signed in, exiting');
      return;
    }

    console.log('PushNotificationInitializer: Effect started');
    if (Capacitor.getPlatform() !== 'ios') {
      console.log('PushNotificationInitializer: Not iOS platform, exiting');
      return;
    }

    const initializePushNotifications = async () => {
      console.log(
        'PushNotificationInitializer: Initializing push notifications'
      );
      // Check if the user already has a token
      if (!userToken) {
        console.log(
          'PushNotificationInitializer: No user token found, requesting permissions'
        );
        try {
          const result = await PushNotifications.requestPermissions();
          console.log(
            'PushNotificationInitializer: Permission request result:',
            result
          );
          if (result.receive === 'granted') {
            console.log(
              'PushNotificationInitializer: Permission granted, registering'
            );
            await PushNotifications.register();
            console.log('PushNotificationInitializer: Registration complete');
          } else {
            console.log(
              'PushNotificationInitializer: Push notification permission denied'
            );
          }
        } catch (error) {
          console.error(
            'PushNotificationInitializer: Error requesting push notification permissions:',
            error
          );
        }
      } else {
        console.log(
          'PushNotificationInitializer: User token already exists:',
          userToken
        );
      }
    };

    initializePushNotifications();

    // Add listeners for push notifications
    PushNotifications.addListener('registration', async (token) => {
      console.log(
        'PushNotificationInitializer: Push registration success, token:',
        token.value
      );
      await storeDeviceToken({ deviceToken: token.value });
      console.log('PushNotificationInitializer: Device token stored');
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration:', error);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('notificationReceived:', { notification });
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log('notificationActionPerformed:', { notification });
      }
    );

    return () => {
      console.log('PushNotificationInitializer: Cleaning up listeners');
      PushNotifications.removeAllListeners();
    };
  }, [isSignedIn, userToken, storeDeviceToken]);

  // This component doesn't render anything visible
  return null;
}
