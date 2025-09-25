'use client';

import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';

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

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch conversations
  const { data: conversationsData, error: conversationsError, mutate: mutateConversations } = useSWR(
    '/api/messages/conversations',
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    }
  );

  // Fetch messages for selected conversation
  const { data: messagesData, error: messagesError, mutate: mutateMessages } = useSWR(
    selectedConversationId ? `/api/messages/${selectedConversationId}` : null,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    }
  );

  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData);
      setIsLoading(false);
    }
  }, [conversationsData]);

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!selectedConversationId || !text.trim()) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'current-user', // This should come from auth context
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Optimistic update
    setMessages(prev => [...prev, newMessage]);

    try {
      const response = await fetch(`/api/messages/${selectedConversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const sentMessage = await response.json();
      
      // Update with server response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? sentMessage : msg
        )
      );

      // Update conversation's last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversationId 
            ? {
                ...conv,
                lastMessage: {
                  text: text.trim(),
                  timestamp: new Date().toISOString(),
                  isRead: false,
                  senderId: 'current-user',
                },
                unreadCount: 0,
              }
            : conv
        )
      );

      // Refresh conversations
      mutateConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert optimistic update
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }
  }, [selectedConversationId, mutateConversations]);

  const sendImage = useCallback(async (file: File) => {
    if (!selectedConversationId) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/api/messages/${selectedConversationId}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send image');
      }

      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      mutateConversations();
    } catch (error) {
      console.error('Error sending image:', error);
    }
  }, [selectedConversationId, mutateConversations]);

  const sendFile = useCallback(async (file: File) => {
    if (!selectedConversationId) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/messages/${selectedConversationId}/file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send file');
      }

      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      mutateConversations();
    } catch (error) {
      console.error('Error sending file:', error);
    }
  }, [selectedConversationId, mutateConversations]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'POST',
      });

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, []);

  const handleRentalAction = useCallback(async (action: string, rentalId: string) => {
    try {
      const response = await fetch(`/api/rentals/${rentalId}/${action}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} rental`);
      }

      // Update conversation's rental request status
      setConversations(prev => 
        prev.map(conv => 
          conv.rentalRequest?.id === rentalId 
            ? {
                ...conv,
                rentalRequest: {
                  ...conv.rentalRequest,
                  status: action === 'approve' ? 'approved' : 
                          action === 'reject' ? 'rejected' :
                          action === 'confirm_pickup' ? 'picked_up' :
                          action === 'confirm_dropoff' ? 'completed' :
                          conv.rentalRequest.status,
                },
              }
            : conv
        )
      );

      mutateConversations();
    } catch (error) {
      console.error(`Error ${action}ing rental:`, error);
    }
  }, [mutateConversations]);

  const startConversation = useCallback(async (userId: string, gearId?: string) => {
    try {
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, gearId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }

      const newConversation = await response.json();
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversationId(newConversation.id);
      
      return newConversation;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }, []);

  return {
    conversations,
    messages,
    selectedConversationId,
    isLoading,
    error: conversationsError || messagesError,
    selectConversation,
    sendMessage,
    sendImage,
    sendFile,
    markAsRead,
    handleRentalAction,
    startConversation,
    mutateConversations,
    mutateMessages,
  };
};

export const useConversation = (conversationId: string | null) => {
  const { data, error, mutate } = useSWR(
    conversationId ? `/api/messages/conversations/${conversationId}` : null,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch conversation');
      return response.json();
    }
  );

  return {
    conversation: data,
    isLoading: !data && !error,
    error,
    mutate,
  };
};

export const useUnreadCount = () => {
  const { data, error } = useSWR(
    '/api/messages/unread-count',
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch unread count');
      return response.json();
    }
  );

  return {
    unreadCount: data?.count || 0,
    isLoading: !data && !error,
    error,
  };
};
