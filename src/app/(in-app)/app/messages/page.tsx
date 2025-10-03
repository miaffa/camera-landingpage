"use client";

import React, { useState } from "react";
import { MessagesHeader } from "@/components/messages/MessagesHeader";
import { ConversationSearch } from "@/components/messages/ConversationSearch";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { ConversationDetail } from "@/components/messages/ConversationDetail";

interface Conversation {
  id: string;
  bookingId: string;
  name: string;
  email: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  status: string;
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // Show conversation detail if one is selected
  if (selectedConversation) {
    return (
      <div className="h-screen flex flex-col">
        <ConversationDetail 
          conversation={selectedConversation}
          onBack={handleBackToList}
        />
      </div>
    );
  }

  // Show conversations list
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
