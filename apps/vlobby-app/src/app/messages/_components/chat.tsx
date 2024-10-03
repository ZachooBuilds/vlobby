'use client';
import React from 'react';
import { useMutation } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { ChatSummary, Message } from '../../../lib/app-types';
import { ChatList } from './chat-list';

/**
 * Chat Component
 *
 * This component represents the main chat interface, including the chat topbar and the list of messages.
 * It handles sending new messages using Convex without managing local state.
 *
 * @component
 * @example
 * ```jsx
 * <Chat
 *   messages={[
 *     { _id: "1", content: "Hello", isFromOccupant: false, createdAt: "2023-01-01T00:00:00Z" },
 *     { _id: "2", content: "Hi there!", isFromOccupant: true, createdAt: "2023-01-01T00:01:00Z" }
 *   ]}
 *   selectedChat={{ _id: "chat1", OccupantName: "John Doe", lastMessage: "Hello", lastMessageDate: "2023-01-01T00:00:00Z" }}
 *   isMobile={false}
 * />
 * ```
 */
interface ChatProps {
  messages?: Message[];
  selectedChat: ChatSummary;
  isMobile: boolean;
}

export function Chat({ messages, selectedChat, isMobile }: ChatProps) {
  // Convex mutation to add a new message
  const addMessage = useMutation(api.chats.addMessage);

  // Function to handle sending a new message
  const sendMessage = async (message: Message) => {
    if (!selectedChat) return;

    try {
      await addMessage({
        chatId: selectedChat._id as Id<'chats'>,
        content: message.content,
        isFromOccupant: true,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      {/* Display the chat topbar with selected chat information */}
      {/* <ChatTopbar selectedChat={selectedChat} /> */}

      {/* Display the list of messages and provide functionality to send new messages */}
      <ChatList
        messages={messages}
        selectedChat={selectedChat}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
