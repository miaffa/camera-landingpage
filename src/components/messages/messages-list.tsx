'use client';

import { useState } from 'react';
import { MessageCircle, Check, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button'; // TODO: Implement button functionality
import { Card, CardContent } from '@/components/ui/card';

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
    isOnline: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
  };
  unreadCount: number;
  rentalRequest?: {
    id: string;
    gearName: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'picked_up';
    totalCost: number;
  };
}

interface MessagesListProps {
  conversations: Conversation[];
  onConversationSelect: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

export default function MessagesList({ 
  conversations, 
  onConversationSelect, 
  selectedConversationId 
}: MessagesListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return messageTime.toLocaleDateString();
  };

  const getStatusIcon = (isRead: boolean, senderId: string, currentUserId: string) => {
    if (senderId === currentUserId) {
      return isRead ? <CheckCheck className="w-4 h-4 text-blue-500" /> : <Check className="w-4 h-4 text-gray-400" />;
    }
    return null;
  };

  const getRentalStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-black mb-4">Messages</h2>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MessageCircle className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No conversations yet</h3>
            <p className="text-gray-500">Start a conversation by renting gear or messaging users</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  selectedConversationId === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => onConversationSelect(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.participant.avatar} />
                        <AvatarFallback className="bg-gray-200">
                          {conversation.participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-black truncate">
                            {conversation.participant.name}
                          </h3>
                          {conversation.participant.isVerified && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(conversation.lastMessage.timestamp)}
                          </span>
                          {getStatusIcon(
                            conversation.lastMessage.isRead,
                            conversation.lastMessage.senderId,
                            'current-user-id' // This should come from auth context
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conversation.lastMessage.text}
                      </p>

                      {/* Rental Request Badge */}
                      {conversation.rentalRequest && (
                        <div className="flex items-center gap-2">
                          <Badge className={getRentalStatusColor(conversation.rentalRequest.status)}>
                            {conversation.rentalRequest.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {conversation.rentalRequest.gearName} • ${conversation.rentalRequest.totalCost}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
