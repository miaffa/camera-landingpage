'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Image, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  timestamp: string;
  isRead: boolean;
  rentalRequest?: {
    id: string;
    gearName: string;
    status: string;
    totalCost: number;
  };
}

interface Participant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
}

interface MessageChatProps {
  conversation: {
    id: string;
    participant: Participant;
    rentalRequest?: {
      id: string;
      gearName: string;
      status: string;
      totalCost: number;
    };
  };
  messages: Message[];
  onSendMessage: (text: string) => void;
  onSendImage: (file: File) => void;
  onSendFile: (file: File) => void;
  onRentalAction: (action: string, rentalId: string) => void;
  currentUserId: string;
}

export default function MessageChat({
  conversation,
  messages,
  onSendMessage,
  onSendImage,
  onSendFile,
  onRentalAction,
  currentUserId
}: MessageChatProps) {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onSendImage(file);
      } else {
        onSendFile(file);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getRentalActionButtons = (rentalRequest: any) => {
    switch (rentalRequest.status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => onRentalAction('approve', rentalRequest.id)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRentalAction('reject', rentalRequest.id)}
            >
              Reject
            </Button>
          </div>
        );
      case 'approved':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => onRentalAction('confirm_pickup', rentalRequest.id)}
            >
              Confirm Pickup
            </Button>
          </div>
        );
      case 'picked_up':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={() => onRentalAction('confirm_dropoff', rentalRequest.id)}
            >
              Confirm Dropoff
            </Button>
          </div>
        );
      case 'completed':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRentalAction('rate', rentalRequest.id)}
          >
            Rate Experience
          </Button>
        );
      default:
        return null;
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={conversation.participant.avatar} />
              <AvatarFallback className="bg-gray-200">
                {conversation.participant.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-black">{conversation.participant.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">@{conversation.participant.username}</span>
                {conversation.participant.isVerified && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Verified</Badge>
                )}
                <div className={`w-2 h-2 rounded-full ${conversation.participant.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Phone className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Video className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Rental Request Info */}
        {conversation.rentalRequest && (
          <Card className="mt-3 bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-black">{conversation.rentalRequest.gearName}</h4>
                  <p className="text-sm text-gray-600">${conversation.rentalRequest.totalCost}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {conversation.rentalRequest.status}
                  </Badge>
                  {getRentalActionButtons(conversation.rentalRequest)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="text-center mb-4">
              <Badge variant="outline" className="bg-gray-100 text-gray-600">
                {date}
              </Badge>
            </div>
            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.senderId === currentUserId ? 'ml-12' : 'mr-12'}`}>
                  {message.senderId !== currentUserId && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={conversation.participant.avatar} />
                        <AvatarFallback className="bg-gray-200 text-xs">
                          {conversation.participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">{conversation.participant.name}</span>
                    </div>
                  )}
                  
                  <div
                    className={`p-3 rounded-lg ${
                      message.senderId === currentUserId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    {message.text && <p className="text-sm">{message.text}</p>}
                    
                    {message.imageUrl && (
                      <img
                        src={message.imageUrl}
                        alt="Message attachment"
                        className="mt-2 rounded-lg max-w-full h-auto"
                      />
                    )}
                    
                    {message.fileUrl && (
                      <div className="mt-2 p-2 bg-white bg-opacity-20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-sm truncate">{message.fileName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-1 mt-1 ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    {message.senderId === currentUserId && (
                      <div className="text-blue-500">
                        {message.isRead ? '✓✓' : '✓'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="min-h-[40px] max-h-32 resize-none"
              rows={1}
            />
          </div>
          
          <div className="flex items-center gap-1">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => imageInputRef.current?.click()}
            >
              <Image className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
            >
              <Smile className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
