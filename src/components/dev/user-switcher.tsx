"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAllMockUsers, getMockUserById, setCurrentMockUser, MockUser } from '@/lib/mock-users';
import { mutate } from 'swr';

interface UserSwitcherProps {
  onUserChange?: (user: MockUser) => void;
}

export default function UserSwitcher({ onUserChange }: UserSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('user-001');
  
  const users = getAllMockUsers();
  const currentUser = getMockUserById(currentUserId) || users[0];

  const handleUserSelect = async (userId: string) => {
    setCurrentUserId(userId);
    setCurrentMockUser(userId); // Update the global mock user
    const selectedUser = getMockUserById(userId);
    if (selectedUser && onUserChange) {
      onUserChange(selectedUser);
    }
    setIsOpen(false);
    
    // Refresh all SWR data to update the UI
    await mutate('/api/user/me');
    await mutate('/api/feed');
    await mutate('/api/gear');
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="bg-white/90 backdrop-blur-sm"
      >
        <Avatar className="w-6 h-6 mr-2">
          <AvatarImage src={currentUser.image} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        Switch User
      </Button>
      
      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 bg-white/95 backdrop-blur-sm border shadow-lg">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Switch Mock User</h3>
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    currentUserId === user.id ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-gray-500">@{user.username}</div>
                    <div className="text-xs text-gray-400">{user.plan} • {user.location}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              This switcher only appears in development mode.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
