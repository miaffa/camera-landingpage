import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

interface ConversationItemProps {
  conversation: Conversation;
  onClick: (conversation: Conversation) => void;
}

export function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={() => onClick(conversation)}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.avatar} />
          <AvatarFallback>
            {conversation.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        {conversation.isOnline && (
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold truncate">{conversation.name}</h3>
          <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {conversation.lastMessage}
        </p>
      </div>
      {conversation.unreadCount > 0 && (
        <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {conversation.unreadCount}
        </Badge>
      )}
    </div>
  );
}
