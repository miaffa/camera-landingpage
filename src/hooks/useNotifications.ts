"use client";

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'rental_request' | 'rental_approved' | 'rental_rejected';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  data?: any; // Additional data specific to notification type
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = supabaseBrowser();

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Development mode - always return mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - returning mock notifications');
        
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'like',
            title: 'New Like',
            message: 'Someone liked your post "Golden hour portrait"',
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'comment',
            title: 'New Comment',
            message: 'John Doe commented on your post',
            is_read: false,
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          },
          {
            id: '3',
            type: 'rental_request',
            title: 'Rental Request',
            message: 'Someone wants to rent your Canon EOS R5',
            is_read: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
        ];

        setNotifications(mockNotifications);
        setIsLoading(false);
        return;
      }

      // Production mode - use Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      // TODO: Implement notifications table and API
      // For now, return mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'like',
          title: 'New Like',
          message: 'Someone liked your post "Golden hour portrait"',
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'comment',
          title: 'New Comment',
          message: 'John Doe commented on your post',
          is_read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: '3',
          type: 'rental_request',
          title: 'Rental Request',
          message: 'Someone wants to rent your Canon EOS R5',
          is_read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
      ];

      setNotifications(mockNotifications);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: Implement mark as read API
      console.log('Marking notification as read:', notificationId);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Implement mark all as read API
      console.log('Marking all notifications as read');
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const refresh = async () => {
    await loadNotifications();
  };

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
  };
}
