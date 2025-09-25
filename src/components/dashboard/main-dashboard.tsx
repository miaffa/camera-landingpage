"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';
import SocialFeed from '@/components/feed/social-feed';
import MarketplaceSearch from '@/components/marketplace/marketplace-search';
import MessagesMain from '@/components/messages/messages-main';
import RentalDashboard from '@/components/profile/rental-dashboard';
import PostCreation from '@/components/create/post-creation';
import UserSwitcher from '@/components/dev/user-switcher';

// Tab configuration
const tabs = [
  {
    id: 'feed',
    label: 'Feed',
    icon: Home,
    component: SocialFeed
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    component: MarketplaceSearch
  },
  {
    id: 'create',
    label: 'Create',
    icon: Plus,
    component: PostCreation
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageCircle,
    component: MessagesMain
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    component: RentalDashboard
  }
];

// Bottom Navigation Component
function BottomNavigation({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs mt-1 truncate font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState('feed');
  const searchParams = useSearchParams();

  // Handle URL parameters for deep linking
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabs.find(tab => tab.id === tabParam)) {
      setActiveTab(tabParam);
    } else {
      // Default to feed tab when no valid tab parameter is provided
      setActiveTab('feed');
    }
  }, [searchParams]);

  const currentTab = tabs.find(tab => tab.id === activeTab);
  const CurrentComponent = currentTab?.component || SocialFeed;

  return (
    <div className="flex flex-col h-screen">
      <UserSwitcher />
      <div className="flex-1 overflow-y-auto pb-16">
        <CurrentComponent />
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
