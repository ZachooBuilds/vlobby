'use client';

import { Badge } from '@tremor/react';
import { useEffect, useState } from 'react';
import ChatSidebar from './chat-sidebar';
import { Chat } from './chat';
import { Loader2 } from 'lucide-react'; // Add this import
import { useMutation, useQuery } from 'convex/react';
import { api } from '@repo/backend/convex/_generated/api';
import {
  ChatSummary,
  Message,
  ValueLabelPair,
} from '../../../lib/app-data/app-types';
import { Id } from '@repo/backend/convex/_generated/dataModel';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { Button } from '@repo/ui/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/ui/command';

export function ChatWindow({ selectedChatId }: { selectedChatId?: Id<'chats'> }) {
  const occupants = useQuery(
    api.occupants.getAllOccupantsValueLabelPair
  ) as ValueLabelPair[];
  const allChats = useQuery(api.chats.getChatSummaries) as ChatSummary[];
  const [selectedChat, setSelectedChat] = useState<ChatSummary | null>(null);

  console.log('selected chat', selectedChat);

  const createChat = useMutation(api.chats.upsertChat);

  const chatMessages = useQuery(
    api.chats.getChat,
    selectedChat ? { chatId: selectedChat._id as Id<'chats'> } : 'skip'
  ) as Message[];

  const markChatAsRead = useMutation(api.chats.markChatAsRead);

  const handleChatSelect = (chat: ChatSummary) => {
    setSelectedChat(chat);
    void markChatAsRead({ chatId: chat._id as Id<'chats'> });
  };

  useEffect(() => {
    if (selectedChatId) {
      const chat = allChats?.find(chat => chat._id === selectedChatId);
      if (chat) {
        setSelectedChat(chat);
        void markChatAsRead({ chatId: chat._id as Id<'chats'> });
      }
    } else if (allChats && allChats.length > 0 && !selectedChat) {
      setSelectedChat(allChats[0] as ChatSummary);
    }
  }, [selectedChatId, allChats, selectedChat, markChatAsRead]);

  return (
    <div className="flex h-full w-full flex-row items-start justify-start gap-2">
      {/* Left hand panel */}
      <div className="flex h-full w-[40%] flex-col items-start justify-start ">
        <div className="flex w-full flex-row items-center justify-between p-4">
          <div className="flex flex-row items-center gap-2 ">
            <p className="text-md font-medium text-foreground">Messages</p>
            <Badge size="xs">3</Badge>
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  New Chat
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search occupants..." />
                  <CommandList>
                    <CommandEmpty>No occupants found.</CommandEmpty>
                    <CommandGroup>
                      {occupants?.map((occupant) => (
                        <CommandItem
                          key={occupant.value}
                          onSelect={() => {
                            void createChat({
                              occupantId: occupant.value as Id<'users'>,
                            });
                          }}
                        >
                          {occupant.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-start justify-start overflow-scroll">
          <ChatSidebar
            selectedChat={selectedChat}
            chats={allChats}
            onChatSelect={handleChatSelect}
          />
        </div>
      </div>
      {/* Right hand panel */}
      <div className="flex h-full w-[60%] flex-col items-start justify-start border-l border-muted p-2">
        {selectedChat ? (
          !chatMessages ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Chat
              messages={chatMessages}
              selectedChat={selectedChat}
              isMobile={false}
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-muted-foreground">No message selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
