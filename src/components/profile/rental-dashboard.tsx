"use client";

import { useState } from 'react';
import { Settings, Camera, Star, Grid, Bookmark, MapPin, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge'; // TODO: Implement badge functionality
import useSWR from 'swr';
import GearHubView from './gear-hub-view';
import GalleryView from './gallery-view';
import SavedView from './saved-view';

// Import user type
import { MockUser as User } from '@/lib/mock-users';

interface UserResponse {
  user: User;
}


// Header Component
function DashboardHeader({ user }: { user: User }) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image} />
            <AvatarFallback className="bg-gray-200">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-black">Rental Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user.name.split(' ')[0]}</p>
          </div>
        </div>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Dashboard Summary Cards
function SummaryCards({ user }: { user: User }) {
  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Active Gear Card */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Camera className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-black mb-1">{user.stats.activeGear}</div>
          <div className="text-sm text-gray-600">Active Gear</div>
          <div className="text-xs text-gray-500 mt-1">Ready to rent</div>
        </div>

        {/* Rating Card */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Star className="h-6 w-6 text-pink-500" />
          </div>
          <div className="text-2xl font-bold text-black mb-1">{user.stats.rating}</div>
          <div className="text-sm text-gray-600">Rating</div>
          <div className="text-xs text-gray-500 mt-1">{user.stats.rentals} reviews</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Posts Card */}
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-black mb-1">{user.stats.posts}</div>
          <div className="text-sm text-gray-600">Posts</div>
        </div>

        {/* Rentals Card */}
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-black mb-1">{user.stats.rentals}</div>
          <div className="text-sm text-gray-600">Rentals</div>
        </div>

        {/* Followers Card */}
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-black mb-1">{user.stats.followers}</div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>
      </div>
    </div>
  );
}

// User Profile Section
function UserProfileSection({ user }: { user: User }) {
  return (
    <div className="px-4 py-4">
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.image} />
              <AvatarFallback className="bg-gray-200">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-black">{user.name}</h3>
              <p className="text-sm text-gray-600">@{user.username}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                <span>{user.location}</span>
              </div>
              {user.bio && (
                <p className="text-sm text-gray-600 mt-2 max-w-xs">{user.bio}</p>
              )}
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}

// Navigation Tabs
function NavigationTabs({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: 'gear-hub', label: 'Gear', icon: Camera },
    { id: 'gallery', label: 'Gallery', icon: Grid },
    { id: 'saved', label: 'Saved', icon: Bookmark }
  ];

  return (
    <div className="px-4 py-3">
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium flex-1 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}


// Tab Content Component
function TabContent({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case 'gear-hub':
      return <GearHubView />;
    case 'gallery':
      return <GalleryView />;
    case 'saved':
      return <SavedView />;
    default:
      return <GearHubView />;
  }
}

// Main Rental Dashboard Component
export default function RentalDashboard() {
  const [activeTab, setActiveTab] = useState('gear-hub');
  const { data, error, isLoading } = useSWR<UserResponse>('/api/user/me');

  if (isLoading) {
    return (
      <div className="bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load profile</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const user = data?.user;

  if (!user) {
    return (
      <div className="bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600">No user data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <DashboardHeader user={user} />
      <SummaryCards user={user} />
      <UserProfileSection user={user} />
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContent activeTab={activeTab} />
    </div>
  );
}
