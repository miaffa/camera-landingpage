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
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    // Trigger refresh of conversations list
    setRefreshKey(prev => prev + 1);
  };

  // Show conversation detail if one is selected
  if (selectedConversation) {
    return (
        <div className="h-screen flex flex-col">
          <ConversationDetail
            conversation={selectedConversation}
            onBack={handleBackToList}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
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
            key={refreshKey}
            searchQuery={searchQuery}
            onConversationClick={handleConversationClick}
          />
    </div>
  );
}
