import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatBottombar from './chat-bottom-bar';
import { format } from 'date-fns';
import { ChatSummary, Message } from '../../../lib/app-data/app-types';
import { cn } from '@repo/ui/lib/utils';
import { Avatar, AvatarFallback } from '@repo/ui/components/ui/avatar';

/**
 * ChatList Component
 *
 * This component renders a list of chat messages with animations and a bottom bar for sending new messages.
 * It handles message display, scrolling, and animations for a smooth chat experience.
 *
 * @component
 * @example
 * ```jsx
 * <ChatList
 *   messages={[
 *     { chatId: "chat1", content: "Hello", isFromOccupant: false },
 *     { chatId: "chat1", content: "Hi there!", isFromOccupant: true }
 *   ]}
 *   selectedChat={{ _id: "chat1", OccupantName: "John Doe", lastMessage: "Hello", lastMessageDate: new Date() }}
 *   sendMessage={(newMessage) => console.log("New message:", newMessage)}
 *   isMobile={false}
 * />
 * ```
 */

interface ChatListProps {
  messages?: Message[];
  selectedChat: ChatSummary;
  sendMessage: (newMessage: Message) => void;
  isMobile: boolean;
}

export function ChatList({
  messages,
  selectedChat,
  sendMessage,
}: ChatListProps) {
  // Reference to the messages container for auto-scrolling
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages are added
  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: 'spring',
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                'flex flex-col gap-2 whitespace-pre-wrap p-4',
                message.isFromOccupant ? 'items-start' : 'items-end'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Display avatar for messages from the occupant */}
                {message.isFromOccupant && (
                  <Avatar className="h-12 w-12 transition-all duration-300 group-hover:scale-110">
                    <AvatarFallback>
                      {selectedChat.OccupantName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col">
                  {/* Message content */}
                  <span
                    className={cn(
                      'max-w-sm rounded-md p-3 text-sm',
                      message.isFromOccupant
                        ? 'bg-accent'
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    {message.content}
                  </span>
                  {/* Message timestamp */}
                  <span className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(message.createdAt), 'PPpp')}
                  </span>
                </div>
                {/* Display avatar for messages from the admin */}
                {!message.isFromOccupant && (
                  <Avatar className="h-12 w-12 transition-all duration-300 group-hover:scale-110">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Chat bottom bar for sending messages */}
      <ChatBottombar
        sendMessage={sendMessage}
        chatId={selectedChat._id}
        isFromOccupant={false}
      />
    </div>
  );
}
