import React from "react";
import { MessageCircle } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import useSWR from "swr";

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

interface ConversationsListProps {
  searchQuery: string;
  onConversationClick: (conversation: Conversation) => void;
}

export function ConversationsList({ searchQuery, onConversationClick }: ConversationsListProps) {
  // Fetch real conversations from API
  const fetcher = async (url: string): Promise<Conversation[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }
    return response.json();
  };

  const { data: conversations, error, isLoading } = useSWR<Conversation[]>(
    "/api/messages/conversations",
    fetcher
  );

  // Filter conversations based on search query
  const filteredConversations = (conversations || []).filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading conversations...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-red-100 p-6 mb-4">
          <MessageCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-red-600">
          Failed to load conversations
        </h3>
        <p className="text-muted-foreground max-w-sm">
          There was an error loading your messages. Please try again.
        </p>
      </div>
    );
  }

  // Empty state
  if (filteredConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <MessageCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {searchQuery ? "No conversations found" : "No messages yet"}
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {searchQuery 
            ? `No conversations match "${searchQuery}".`
            : "Start a conversation by booking gear or listing your equipment."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 md:gap-2">
      {filteredConversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          onClick={onConversationClick}
        />
      ))}
    </div>
  );
}
