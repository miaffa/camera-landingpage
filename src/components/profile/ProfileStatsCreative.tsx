import React from "react";
import { Camera, Star, Users, TrendingUp, DollarSign, MessageSquare, Zap, Heart } from "lucide-react";
import { mockGearListings, mockPosts } from "@/lib/data/mock-data";

// Creative Option: Dashboard Tiles with Visual Elements
export function ProfileStatsDashboard() {
  const stats = [
    {
      icon: Camera,
      value: mockGearListings.length,
      label: "Active Gear",
      subtitle: "Ready to rent",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+2 this week"
    },
    {
      icon: Star,
      value: "4.8",
      label: "Rating",
      subtitle: "12 reviews",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      trend: "Excellent"
    },
    {
      icon: MessageSquare,
      value: mockPosts.length,
      label: "Posts",
      subtitle: "Content shared",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      trend: "Active"
    },
    {
      icon: Users,
      value: "1.2k",
      label: "Followers",
      subtitle: "Community",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "+45 this month"
    },
    {
      icon: DollarSign,
      value: "$2.4k",
      label: "Earnings",
      subtitle: "This month",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "+12%"
    },
    {
      icon: TrendingUp,
      value: "47",
      label: "Rentals",
      subtitle: "Completed",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      trend: "Growing"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bgColor} rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg bg-white/60 group-hover:bg-white/80 transition-colors`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            <div className="text-xs text-gray-500 font-medium">{stat.trend}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm font-medium text-gray-700">{stat.label}</div>
            <div className="text-xs text-gray-500">{stat.subtitle}</div>
          </div>

          {/* Gradient accent line */}
          <div className={`h-1 w-full rounded-full bg-gradient-to-r ${stat.color} mt-3 opacity-60`} />
        </div>
      ))}
    </div>
  );
}

// Creative Option: Circular Progress Rings
export function ProfileStatsCircular() {
  const stats = [
    { icon: Camera, value: mockGearListings.length, label: "Gear", progress: 80, color: "blue" },
    { icon: Star, value: "4.8", label: "Rating", progress: 96, color: "yellow" },
    { icon: MessageSquare, value: mockPosts.length, label: "Posts", progress: 60, color: "green" },
    { icon: Users, value: "1.2k", label: "Followers", progress: 75, color: "purple" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-100 text-center">
          <div className="relative w-16 h-16 mx-auto mb-3">
            {/* Circular progress ring */}
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`text-${stat.color}-500`}
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${stat.progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            
            {/* Icon in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
            </div>
          </div>
          
          <div className="text-xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// Creative Option: Activity Feed Style
export function ProfileStatsActivity() {
  const activities = [
    { icon: Camera, action: "Added new gear", count: mockGearListings.length, color: "blue" },
    { icon: MessageSquare, action: "Shared posts", count: mockPosts.length, color: "green" },
    { icon: Users, action: "Gained followers", count: "1.2k", color: "purple" },
    { icon: Star, action: "Received rating", count: "4.8★", color: "yellow" },
    { icon: DollarSign, action: "Earned money", count: "$2.4k", color: "emerald" },
    { icon: TrendingUp, action: "Completed rentals", count: "47", color: "pink" },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-blue-600" />
        Your Activity
      </h3>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.action} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`p-2 rounded-lg bg-${activity.color}-100`}>
              <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">{activity.action}</div>
            </div>
            <div className="text-lg font-bold text-gray-900">{activity.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Creative Option: Minimalist Badges
export function ProfileStatsBadges() {
  const badges = [
    { icon: Camera, value: mockGearListings.length, label: "Gear", color: "blue" },
    { icon: MessageSquare, value: mockPosts.length, label: "Posts", color: "green" },
    { icon: Users, value: "1.2k", label: "Followers", color: "purple" },
    { icon: Star, value: "4.8", label: "Rating", color: "yellow" },
    { icon: DollarSign, value: "$2.4k", label: "Earnings", color: "emerald" },
    { icon: Heart, value: "47", label: "Rentals", color: "pink" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className={`flex items-center gap-2 px-3 py-2 bg-${badge.color}-50 border border-${badge.color}-200 rounded-full hover:bg-${badge.color}-100 transition-colors cursor-pointer`}
        >
          <badge.icon className={`h-4 w-4 text-${badge.color}-600`} />
          <span className="text-sm font-semibold text-gray-900">{badge.value}</span>
          <span className="text-xs text-gray-500">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
