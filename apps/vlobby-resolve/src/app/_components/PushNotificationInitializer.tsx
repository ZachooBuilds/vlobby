'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { useMutation } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { useAuth } from '@clerk/clerk-react';

export default function PushNotificationInitializer() {
  const storeDeviceToken = useMutation(api.pushNotifications.storeDeviceToken);
  const { isSignedIn } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  const addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
      storeDeviceToken({ deviceToken: token.value })
        .then(() => console.log('Device token stored successfully'))
        .catch(error => console.error('Error storing device token:', error));
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  };

  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.error('User denied permissions!');
      return;
    }

    await PushNotifications.register();
    console.log('Push notifications registered');
  };

  const initializePushNotifications = async () => {
    if (!isSignedIn) {
      console.log('User not signed in, exiting');
      return;
    }

    if (Capacitor.getPlatform() !== 'ios' && Capacitor.getPlatform() !== 'android') {
      console.log('Not a mobile platform, exiting');
      return;
    }

    try {
      await addListeners();
      await registerNotifications();
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  };

  useEffect(() => {
    if (!isInitialized && isSignedIn) {
      setTimeout(() => {
        initializePushNotifications();
      }, 5000);
    }

    return () => {
      if (isInitialized) {
        console.log('Cleaning up listeners');
        PushNotifications.removeAllListeners();
      }
    };
  }, [isSignedIn, isInitialized]);

  // This component doesn't render anything visible
  return null;
}
