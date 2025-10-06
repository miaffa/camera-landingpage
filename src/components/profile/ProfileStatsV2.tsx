import React from "react";
import { Camera, Star, Users, TrendingUp, DollarSign, MessageSquare } from "lucide-react";
import { mockGearListings, mockPosts } from "@/lib/data/mock-data";

// Option 1: Minimalist Horizontal Stats
export function ProfileStatsMinimal() {
  const stats = [
    { icon: Camera, value: mockGearListings.length, label: "Gear", color: "text-blue-600" },
    { icon: MessageSquare, value: mockPosts.length, label: "Posts", color: "text-green-600" },
    { icon: Users, value: "1.2k", label: "Followers", color: "text-purple-600" },
    { icon: DollarSign, value: "$2.4k", label: "Earnings", color: "text-orange-600" },
    { icon: Star, value: "4.8", label: "Rating", color: "text-yellow-600" },
    { icon: TrendingUp, value: "47", label: "Rentals", color: "text-pink-600" },
  ];

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white rounded-lg border border-gray-100">
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          <div className="flex flex-col items-center text-center">
            <stat.icon className={`h-5 w-5 ${stat.color} mb-1`} />
            <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
          {index < stats.length - 1 && (
            <div className="w-px h-12 bg-gray-200" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Option 2: Visual Progress Indicators
export function ProfileStatsProgress() {
  const stats = [
    { icon: Camera, value: mockGearListings.length, label: "Active Gear", progress: 80, color: "blue" },
    { icon: Star, value: "4.8", label: "Rating", progress: 96, color: "yellow" },
    { icon: MessageSquare, value: mockPosts.length, label: "Posts", progress: 60, color: "green" },
    { icon: Users, value: "1.2k", label: "Followers", progress: 75, color: "purple" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
              <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-${stat.color}-500 h-2 rounded-full transition-all duration-300`}
              style={{ width: `${stat.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Option 3: Content Preview Cards
export function ProfileStatsContent() {
  return (
    <div className="space-y-4">
      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{mockGearListings.length}</div>
            <div className="text-xs text-gray-500">Gear Items</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">{mockPosts.length}</div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">1.2k</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">Performance</div>
            <div className="text-2xl font-bold text-gray-900">4.8★ Rating</div>
            <div className="text-xs text-gray-500">Based on 12 reviews</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">Earnings</div>
            <div className="text-2xl font-bold text-gray-900">$2.4k</div>
            <div className="text-xs text-gray-500">This month</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Option 4: Compact Metric Bar
export function ProfileStatsCompact() {
  const stats = [
    { icon: Camera, value: mockGearListings.length, label: "Gear" },
    { icon: MessageSquare, value: mockPosts.length, label: "Posts" },
    { icon: Users, value: "1.2k", label: "Followers" },
    { icon: Star, value: "4.8", label: "Rating" },
    { icon: DollarSign, value: "$2.4k", label: "Earnings" },
    { icon: TrendingUp, value: "47", label: "Rentals" },
  ];

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <div className="flex items-center justify-between">
        {stats.map((stat, index) => (
          <div key={stat.label} className="flex items-center gap-2">
            <stat.icon className="h-4 w-4 text-gray-500" />
            <div className="text-sm">
              <span className="font-semibold text-gray-900">{stat.value}</span>
              <span className="text-gray-500 ml-1">{stat.label}</span>
            </div>
            {index < stats.length - 1 && (
              <div className="w-px h-4 bg-gray-200 mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
