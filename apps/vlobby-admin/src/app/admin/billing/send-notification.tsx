'use client';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';

export function SendNotificationButton() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const sendNotification = useMutation(
    api.pushNotifications.sendPushNotificationToUser
  );
  const userIds = useQuery(api.pushNotifications.getAllUserIdsWithTokens);

  const handleSendNotification = async () => {
    if (!title || !body) {
      console.error('Please enter both title and body for the notification.');
      return;
    }

    if (!userIds || userIds.length === 0) {
      console.error('No users with registered device tokens found.');
      return;
    }

    try {
      await sendNotification({
        userId: 'user_2n0UrqN1mJSNpnpYyG2sSZrcFRH',
        title,
        body,
      });
      console.log(`Notification sent to ${userIds.length} users.`);
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Notification Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        placeholder="Notification Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <Button
        onClick={handleSendNotification}
        disabled={!userIds || userIds.length === 0}
      >
        Send Notification to {userIds ? userIds.length : 0} Users
      </Button>
    </div>
  );
}
