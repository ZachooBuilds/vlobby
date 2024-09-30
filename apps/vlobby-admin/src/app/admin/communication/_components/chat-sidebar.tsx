"use client";

// IMPORTS
import React, { useState } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { ChatSummary } from "../../../lib/app-data/app-types";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { Input } from "@repo/ui/components/ui/input";

/**
 * ChatSidebar Component
 *
 * This component renders a sidebar for a chat application, displaying a list of chat summaries.
 * It includes a search functionality to filter chats and highlights the currently selected chat.
 * If no chats are available, it displays a message indicating that no chats have been created.
 *
 * @component
 * @example
 */

// PROPS - Define the properties for the ChatSidebar component
type Props = {
  chats?: ChatSummary[];
  onChatSelect: (chat: ChatSummary) => void;
  selectedChat: ChatSummary | null;
};

// COMPONENT - Main component function for the chat sidebar
export default function ChatSidebar({
  chats,
  onChatSelect,
  selectedChat,
}: Props) {
  // State to hold the current search term
  const [searchTerm, setSearchTerm] = useState("");

  // Filter chats based on the search term
  const filteredChats = chats?.filter((chat) =>
    chat.OccupantName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Function to render individual chat items
  const renderChatItems = () => {
    if (chats?.length === 0 || !chats) {
      return (
        <p className="text-center text-muted-foreground">No chats created</p>
      );
    }

    return filteredChats?.map((chat, index) => (
      <div
        key={index}
        className={`group w-full cursor-pointer rounded-lg p-2 transition-all duration-300 hover:bg-muted ${
          selectedChat && chat._id === selectedChat._id
            ? "bg-blue-500 bg-opacity-10"
            : "bg-background"
        }`}
        onClick={() => onChatSelect(chat)}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 transition-all duration-300 group-hover:scale-110">
            <AvatarFallback>{chat.OccupantName.charAt(0).toUpperCase() + chat.OccupantName.charAt(1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p
                className={`text-sm transition-all duration-300 group-hover:font-bold ${
                  selectedChat && chat._id === selectedChat._id
                    ? "font-bold"
                    : ""
                }`}
              >
                {chat.OccupantName}
              </p>
              {chat.lastMessage && (
                <p className="text-xs text-muted-foreground">
                  {format(new Date(chat.lastMessageDate), "MMM d, yyyy")}
                </p>
              )}
            </div>
            <p className="line-clamp-1 w-full text-sm text-muted-foreground transition-all duration-300 group-hover:font-medium">
              {chat.lastMessage || "New chat"}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex h-full w-full flex-col p-2">
      {/* Search input field */}
      <div className="relative mb-4 w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search chats..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* List of chat items */}
      <div className="flex flex-col gap-2 overflow-scroll">
        {renderChatItems()}
      </div>
    </div>
  );
}
