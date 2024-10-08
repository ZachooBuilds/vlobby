'use node';
import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendFCMNotification = internalAction({
  args: {
    token: v.string(),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('Entering sendFCMNotification handler');
    const { token, title, body } = args;
    console.log('Received args:', { token, title, body });

    const message = {
      notification: {
        title,
        body,
      },
      android: {
        notification: {
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
      token,
    };
    console.log('Constructed message:', message);

    try {
      console.log('Attempting to send message');
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Error sending message:', error);
      console.log('Error details:', JSON.stringify(error, null, 2));
      return { success: false };
    } finally {
      console.log('Exiting sendFCMNotification handler');
    }
  },
});
