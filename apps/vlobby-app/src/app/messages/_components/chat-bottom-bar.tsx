import { FileImage, Paperclip, SendHorizontal, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { cn } from '@repo/ui/lib/utils';
import { buttonVariants } from '@repo/ui/components/ui/button';
import { Message } from '../../../lib/app-types';

interface ChatBottombarProps {
  sendMessage: (newMessage: Message) => void;
  chatId: string;
  isFromOccupant: boolean;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({
  sendMessage,
  chatId,
  isFromOccupant,
}: ChatBottombarProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleThumbsUp = () => {
    const newMessage: Message = {
      createdAt: new Date().toISOString(),
      chatId: chatId,
      content: '👍',
      isFromOccupant: isFromOccupant,
    };
    sendMessage(newMessage);
    setMessage('');
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        createdAt: new Date().toISOString(),
        chatId: chatId,
        content: message.trim(),
        isFromOccupant: isFromOccupant,
      };
      sendMessage(newMessage);
      setMessage('');

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + '\n');
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 p-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className=" w-full"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: 'spring',
              bounce: 0.15,
            },
          }}
        >
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Aa"
            className="min-h-2 w-full items-center overflow-hidden rounded-md border bg-background text-base"
          />
        </motion.div>
        {message.trim() ? (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'h-9 w-9',
              'shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
            )}
            onClick={handleSend}
          >
            <SendHorizontal size={20} className="text-muted-foreground" />
          </Link>
        ) : (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'h-9 w-9',
              'shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
            )}
            onClick={handleThumbsUp}
          >
            <ThumbsUp size={20} className="text-muted-foreground" />
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
}
