"use client";

import React, { useState } from "react";
import { MessagesHeader } from "@/components/messages/MessagesHeader";
import { ConversationSearch } from "@/components/messages/ConversationSearch";
import { ConversationsList } from "@/components/messages/ConversationsList";

interface Conversation {
  id: string;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleConversationClick = (conversation: Conversation) => {
    // TODO: Navigate to conversation detail or open chat
    console.log("Opening conversation with:", conversation.name);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <MessagesHeader />

      {/* Search */}
      <ConversationSearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      {/* Conversations List */}
      <ConversationsList 
        searchQuery={searchQuery} 
        onConversationClick={handleConversationClick} 
      />
    </div>
  );
}
