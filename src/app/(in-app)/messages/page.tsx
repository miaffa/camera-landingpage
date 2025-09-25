'use client';

import { useState, useEffect } from 'react';
import MessagesList from '@/components/messages/messages-list';
import MessageChat from '@/components/messages/message-chat';
import { useAuth } from '@/hooks/useAuth';

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
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data - replace with real API calls
  useEffect(() => {
    const sampleConversations: Conversation[] = [
      {
        id: '1',
        participant: {
          id: 'user1',
          name: 'Alex Rodriguez',
          username: 'alex_rodriguez',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          isVerified: true,
          isOnline: true,
        },
        lastMessage: {
          text: 'Hey! I\'m interested in renting your Canon R5. Is it available this weekend?',
          timestamp: '2024-01-15T10:30:00Z',
          isRead: false,
          senderId: 'user1',
        },
        unreadCount: 2,
        rentalRequest: {
          id: 'rental1',
          gearName: 'Canon EOS R5',
          status: 'pending',
          totalCost: 150,
        },
      },
      {
        id: '2',
        participant: {
          id: 'user2',
          name: 'Sarah Wilson',
          username: 'sarah_wilson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          isVerified: true,
          isOnline: false,
        },
        lastMessage: {
          text: 'Thanks for the great rental experience! The lens was perfect for my shoot.',
          timestamp: '2024-01-14T16:45:00Z',
          isRead: true,
          senderId: 'user2',
        },
        unreadCount: 0,
        rentalRequest: {
          id: 'rental2',
          gearName: 'Sony 24-70mm f/2.8 GM',
          status: 'completed',
          totalCost: 75,
        },
      },
      {
        id: '3',
        participant: {
          id: 'user3',
          name: 'Mike Chen',
          username: 'mike_chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          isVerified: false,
          isOnline: true,
        },
        lastMessage: {
          text: 'Can you send me more photos of the drone? I want to see the condition.',
          timestamp: '2024-01-13T14:20:00Z',
          isRead: true,
          senderId: 'user3',
        },
        unreadCount: 0,
      },
    ];

    setConversations(sampleConversations);
    setIsLoading(false);
  }, []);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Load messages for this conversation
    const sampleMessages: Message[] = [
      {
        id: 'msg1',
        senderId: conversation.participant.id,
        text: 'Hey! I\'m interested in renting your gear. Is it available?',
        timestamp: '2024-01-15T10:00:00Z',
        isRead: true,
      },
      {
        id: 'msg2',
        senderId: user?.id || 'current-user',
        text: 'Hi! Yes, it\'s available. What dates are you looking for?',
        timestamp: '2024-01-15T10:05:00Z',
        isRead: true,
      },
      {
        id: 'msg3',
        senderId: conversation.participant.id,
        text: 'This weekend would be perfect. How much is it per day?',
        timestamp: '2024-01-15T10:10:00Z',
        isRead: true,
      },
      {
        id: 'msg4',
        senderId: user?.id || 'current-user',
        text: 'It\'s $75 per day. I can send you some photos of the current condition.',
        timestamp: '2024-01-15T10:15:00Z',
        isRead: true,
      },
      {
        id: 'msg5',
        senderId: conversation.participant.id,
        text: 'That sounds great! I\'ll send you a rental request.',
        timestamp: '2024-01-15T10:30:00Z',
        isRead: false,
      },
    ];

    setMessages(sampleMessages);
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || 'current-user',
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation's last message
    if (selectedConversation) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? {
                ...conv,
                lastMessage: {
                  text,
                  timestamp: new Date().toISOString(),
                  isRead: false,
                  senderId: user?.id || 'current-user',
                },
                unreadCount: 0,
              }
            : conv
        )
      );
    }
  };

  const handleSendImage = (file: File) => {
    // Handle image upload
    console.log('Sending image:', file.name);
  };

  const handleSendFile = (file: File) => {
    // Handle file upload
    console.log('Sending file:', file.name);
  };

  const handleRentalAction = (action: string, rentalId: string) => {
    console.log('Rental action:', action, rentalId);
    
    // Update rental request status
    if (selectedConversation?.rentalRequest) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? {
                ...conv,
                rentalRequest: {
                  ...conv.rentalRequest!,
                  status: action === 'approve' ? 'approved' : 
                          action === 'reject' ? 'rejected' :
                          action === 'confirm_pickup' ? 'picked_up' :
                          action === 'confirm_dropoff' ? 'completed' :
                          conv.rentalRequest!.status,
                },
              }
            : conv
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200">
        <MessagesList
          conversations={conversations}
          onConversationSelect={handleConversationSelect}
          selectedConversationId={selectedConversation?.id}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedConversation ? (
          <MessageChat
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onSendImage={handleSendImage}
            onSendFile={handleSendFile}
            onRentalAction={handleRentalAction}
            currentUserId={user?.id || 'current-user'}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}