"use client";

import { useState } from 'react';
import { Search, Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Sample data matching the first image
const sampleConversations = [
  {
    id: '1',
    participant: {
      name: 'Alex Rivera',
      avatar: '/placeholder.svg',
      initials: 'A'
    },
    lastMessage: 'Canon R5 pickup confirmed',
    timestamp: '2m ago',
    unreadCount: 1,
    rentalRequest: {
      gearName: 'Canon EOS R5',
      status: 'approved'
    }
  },
  {
    id: '2',
    participant: {
      name: 'Maya Chen',
      avatar: '/placeholder.svg',
      initials: 'M'
    },
    lastMessage: 'Thanks for the great service!',
    timestamp: '1h ago',
    unreadCount: 0,
    rentalRequest: {
      gearName: 'Sony A7IV',
      status: 'completed'
    }
  }
];

interface MessagesInboxProps {
  onConversationSelect: (conversation: typeof sampleConversations[0]) => void;
}

// Header Component
function MessagesHeader() {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold text-black">Messages</h1>
        <button className="p-2 text-gray-600">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Search Bar Component
function SearchBar() {
  return (
    <div className="px-4 py-3">
      <Input
        placeholder="Search conversations..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

// Conversation Item Component
function ConversationItem({ 
  conversation, 
  onSelect 
}: { 
  conversation: typeof sampleConversations[0];
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <Avatar className="w-12 h-12">
          <AvatarImage src={conversation.participant.avatar} />
          <AvatarFallback className="bg-gray-200 text-gray-600">
            {conversation.participant.initials}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Rental Tag */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm text-black truncate">
              {conversation.participant.name}
            </h3>
            <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1 flex items-center gap-1">
              <Camera className="w-3 h-3" />
              Rental
            </Badge>
          </div>

          {/* Message Content */}
          <p className="text-sm text-gray-600 mb-1 truncate">
            {conversation.lastMessage}
          </p>

          {/* Item and Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Camera className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-blue-500 font-medium">
                {conversation.rentalRequest.gearName}
              </span>
            </div>
            <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
              {conversation.rentalRequest.status}
            </Badge>
          </div>
        </div>

        {/* Timestamp and Unread Count */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
          {conversation.unreadCount > 0 && (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{conversation.unreadCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Messages Inbox Component
export default function MessagesInbox({ onConversationSelect }: MessagesInboxProps) {
  return (
    <div className="bg-white">
      <MessagesHeader />
      <SearchBar />
      
      <div className="pb-20">
        {sampleConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onSelect={() => onConversationSelect(conversation)}
          />
        ))}
      </div>
    </div>
  );
}
