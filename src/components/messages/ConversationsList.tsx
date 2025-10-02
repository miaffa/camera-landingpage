import React from "react";
import { MessageCircle } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { mockConversations } from "@/lib/data/messages-data";

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

interface ConversationsListProps {
  searchQuery: string;
  onConversationClick: (conversation: Conversation) => void;
}

export function ConversationsList({ searchQuery, onConversationClick }: ConversationsListProps) {
  // Filter conversations based on search query
  const filteredConversations = mockConversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="flex flex-col gap-2">
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
