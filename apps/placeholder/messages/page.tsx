'use client';

import React, { useEffect, useState } from 'react';
import NavigationBar from '../_components/navigation';
import { CommunicationIconPath } from '../../../public/svg/icons';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import { Message, ChatSummary } from '../../lib/app-types';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import { Chat } from './_components/chat';
import { Card } from '@repo/ui/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function MessagesPage() {
  const occupant = useQuery(api.occupants.getCurrentOccupant);
  const [chatSummary, setChatSummary] = useState<ChatSummary | null>(null);

  const getChatSummary = useMutation(api.chats.getChatSummaryForOccupant);
  const getChat = useQuery(
    api.chats.getChat,
    chatSummary ? { chatId: chatSummary._id as Id<'chats'> } : 'skip'
  );

  useEffect(() => {
    if (occupant?._id) {
      getChatSummary({ occupantId: occupant._id as Id<'users'> })
        .then((result) => {
          if (result) {
            setChatSummary(result);
          }
        })
        .catch((error) => console.error('Error getting chat summary:', error));
    }
  }, [occupant, getChatSummary]);

  const chatMessages = getChat as Message[] | undefined;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-hidden">
        <div className="flex flex-col h-full pt-16 p-4 pb-[120px]">
          <div className="flex flex-row items-center gap-2 mb-4">
            <div className="w-5 h-5 fill-foreground">
              <CommunicationIconPath />
            </div>
            <h2 className="text-xl font-semibold">Reach Out</h2>
          </div>
          <Card className="flex-grow overflow-hidden justify-end">
            {chatMessages && chatSummary ? (
              <Chat
                messages={chatMessages}
                selectedChat={chatSummary}
                isMobile={true}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Fetching messages...
              </div>
            )}
          </Card>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
