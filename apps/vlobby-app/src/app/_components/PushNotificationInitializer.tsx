'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';

export default function PushNotificationInitializer() {
  const storeDeviceToken = useMutation(api.pushNotifications.storeDeviceToken);
  const userToken = useQuery(api.pushNotifications.getUserToken);

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'ios') return;

    const initializePushNotifications = async () => {
      // Check if the user already has a token
      if (!userToken) {
        try {
          const result = await PushNotifications.requestPermissions();
          if (result.receive === 'granted') {
            await PushNotifications.register();
          } else {
            console.log('Push notification permission denied');
          }
        } catch (error) {
          console.error(
            'Error requesting push notification permissions:',
            error
          );
        }
      }
    };

    initializePushNotifications();

    // Add listeners for push notifications
    PushNotifications.addListener('registration', async (token) => {
      console.log('Push registration success, token:', token.value);
      await storeDeviceToken({ deviceToken: token.value });
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
      PushNotifications.removeAllListeners();
    };
  }, [userToken]);

  // This component doesn't render anything visible
  return null;
}
