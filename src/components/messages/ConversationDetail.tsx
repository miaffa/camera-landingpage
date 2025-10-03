"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  message: string;
  senderId: string;
  createdAt: string;
  isSystemMessage: boolean;
  messageType: string;
}

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

interface ConversationDetailProps {
  conversation: Conversation;
  onBack: () => void;
}

export function ConversationDetail({ conversation, onBack }: ConversationDetailProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { data: session } = useSession();

  // Fetch messages for this conversation
  const fetcher = async (url: string): Promise<Message[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    return response.json();
  };

  const { data: messages, error, isLoading, mutate } = useSWR<Message[]>(
    `/api/bookings/${conversation.bookingId}/messages`,
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds for real-time updates
    }
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/bookings/${conversation.bookingId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          messageType: "text",
        }),
      });

      if (response.ok) {
        setNewMessage("");
        mutate(); // Refresh messages
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.avatar} />
          <AvatarFallback>
            {conversation.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{conversation.name}</h2>
          <div className="flex items-center gap-2">
            <Badge 
              variant={conversation.status === 'pending' ? 'secondary' : 
                      conversation.status === 'approved' ? 'default' : 
                      conversation.status === 'cancelled' ? 'destructive' : 'outline'}
              className="text-xs"
            >
              {conversation.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {conversation.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Failed to load messages
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((message) => {
            const isCurrentUser = session?.user?.id === message.senderId;
            
            return (
              <div
                key={message.id}
                className={`flex ${message.isSystemMessage ? 'justify-center' : isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {message.isSystemMessage ? (
                  <div className="bg-gray-100 text-gray-600 text-sm px-3 py-2 rounded-lg">
                    {message.message}
                  </div>
                ) : (
                  <div className="max-w-[70%]">
                    <div className={`px-4 py-2 rounded-lg ${
                      isCurrentUser 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-purple-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="px-6"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
