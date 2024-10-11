'use client';

import { ChatWindow } from './_components/chat-layout';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * CommunicationPage Component
 *
 * This component represents the main communication page in the admin section.
 * It renders the ChatWindow component, allowing for an optional selectedChatId to be passed.
 *
 * The page provides a full-height, scrollable container for the chat interface,
 * allowing admins to view and interact with customer conversations.
 *
 * @param {Object} props - The component props
 * @param {Id<'chats'>} [props.searchParams.selectedChatId] - Optional ID of the chat to be initially selected
 */
export default function CommunicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedChatId = searchParams.get('selectedChatId') as
    | Id<'chats'>
    | undefined;

  useEffect(() => {
    if (selectedChatId) {
      router.replace('/admin/communication');
    }
  }, [selectedChatId, router]);

  return (
    // Main container for the communication page
    <div className="flex h-full flex-col items-start justify-start gap-2">
      {/* Container for the ChatWindow component */}
      <div className="flex h-full w-full flex-col items-start justify-start overflow-scroll rounded-lg bg-background p-4">
        {/* Render the ChatWindow component with selectedChatId */}
        <ChatWindow selectedChatId={selectedChatId} />
      </div>
    </div>
  );
}
