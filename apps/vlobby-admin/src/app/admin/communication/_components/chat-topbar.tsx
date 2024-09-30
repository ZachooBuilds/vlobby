import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import React from "react";
import { ChatSummary } from "../../../lib/app-data/app-types";

/**
 * ChatTopbar Component
 * 
 * This component renders the top bar of a chat interface, displaying information
 * about the selected chat, including the customer's avatar and name.
 *
 * @component
 * @param {Object} props
 * @param {ChatSummary} props.selectedChat - The currently selected chat summary
 *
 * @example
 * ```jsx
 * <ChatTopbar
 *   selectedChat={{
 *     id: "1",
 *     customerName: "John Doe",
 *     lastMessage: "Hello",
 *     lastMessageDate: new Date()
 *   }}
 * />
 * ```
 */
interface ChatTopbarProps {
  selectedChat: ChatSummary;
}

export default function ChatTopbar({ selectedChat }: ChatTopbarProps) {
  return (
    <div className="flex h-20 w-full items-center justify-between border-b border-muted p-4">
      <div className="flex items-center gap-2">
        {/* Customer Avatar */}
        <Avatar className="h-12 w-12 transition-all duration-300 group-hover:scale-110">
          <AvatarFallback>
            {selectedChat.OccupantName.charAt(0).toUpperCase() +
              selectedChat.OccupantName.charAt(1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* Customer Information */}
        <div className="flex flex-col">
          {/* Customer Name */}
          <span className="font-medium">{selectedChat.OccupantName}</span>
          {/* Activity Status - This could be dynamic in a real application */}
          <span className="text-xs">Active 2 mins ago</span>
        </div>
      </div>
    </div>
  );
}
