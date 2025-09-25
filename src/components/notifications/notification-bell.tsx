'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, MessageCircle, Heart, UserPlus, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Card, CardContent } from '@/components/ui/card'; // TODO: Implement card functionality
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { useUnreadCount } from '@/hooks/useMessages'; // TODO: Implement unread count functionality

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'rental_request' | 'rental_approved' | 'rental_completed' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actor?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  actionUrl?: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // const { unreadCount } = useUnreadCount(); // TODO: Implement unread count functionality

  // Sample notifications
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'rental_request',
        title: 'New Rental Request',
        message: 'Alex Rodriguez wants to rent your Canon EOS R5',
        timestamp: '2024-01-15T10:30:00Z',
        isRead: false,
        actor: {
          id: 'user1',
          name: 'Alex Rodriguez',
          username: 'alex_rodriguez',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        },
        actionUrl: '/messages',
      },
      {
        id: '2',
        type: 'like',
        title: 'New Like',
        message: 'Sarah Wilson liked your post',
        timestamp: '2024-01-15T09:15:00Z',
        isRead: false,
        actor: {
          id: 'user2',
          name: 'Sarah Wilson',
          username: 'sarah_wilson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        },
        actionUrl: '/app',
      },
      {
        id: '3',
        type: 'rental_approved',
        title: 'Rental Approved',
        message: 'Your rental request for Sony 24-70mm f/2.8 GM has been approved',
        timestamp: '2024-01-14T16:45:00Z',
        isRead: true,
        actionUrl: '/messages',
      },
      {
        id: '4',
        type: 'follow',
        title: 'New Follower',
        message: 'Mike Chen started following you',
        timestamp: '2024-01-14T14:20:00Z',
        isRead: true,
        actor: {
          id: 'user3',
          name: 'Mike Chen',
          username: 'mike_chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        },
        actionUrl: '/profile',
      },
      {
        id: '5',
        type: 'payment',
        title: 'Payment Received',
        message: 'You received $150 for your Canon EOS R5 rental',
        timestamp: '2024-01-14T12:00:00Z',
        isRead: true,
        actionUrl: '/app/billing',
      },
    ];

    setNotifications(sampleNotifications);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const displayCount = unreadNotifications.length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'rental_request': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'rental_approved': return <Check className="w-4 h-4 text-green-500" />;
      case 'rental_completed': return <Check className="w-4 h-4 text-blue-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-green-500" />;
      case 'system': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // const getNotificationColor = (type: string) => {
//     switch (type) {
//       case 'like': return 'bg-red-50 border-red-200';
//       case 'comment': return 'bg-blue-50 border-blue-200';
//       case 'follow': return 'bg-green-50 border-green-200';
//       case 'rental_request': return 'bg-orange-50 border-orange-200';
//       case 'rental_approved': return 'bg-green-50 border-green-200';
//       case 'rental_completed': return 'bg-blue-50 border-blue-200';
//       case 'payment': return 'bg-green-50 border-green-200';
//       case 'system': return 'bg-gray-50 border-gray-200';
//       default: return 'bg-gray-50 border-gray-200';
//     }
//   };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return notificationTime.toLocaleDateString();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {displayCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
              {displayCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-black">Notifications</h3>
            {displayCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-700"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {notification.actor ? (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={notification.actor.avatar} />
                          <AvatarFallback className="bg-gray-200 text-xs">
                            {notification.actor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-black">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 ml-2">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/notifications';
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
