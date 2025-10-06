import React from "react";
import { Camera, Users, DollarSign, MessageSquare } from "lucide-react";
import { mockGearListings, mockPosts } from "@/lib/data/mock-data";

// Hybrid Option: Minimalist Horizontal + Gradient Background
export function ProfileStatsHybrid() {
  const stats = [
    { icon: Camera, value: mockGearListings.length, label: "Gear", color: "text-blue-600" },
    { icon: MessageSquare, value: mockPosts.length, label: "Posts", color: "text-green-600" },
    { icon: Users, value: "1.2k", label: "Followers", color: "text-purple-600" },
    { icon: DollarSign, value: "$2.4k", label: "Earnings", color: "text-orange-600" },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        {stats.map((stat, index) => (
          <React.Fragment key={stat.label}>
            <div className="flex flex-col items-center text-center">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
            {index < stats.length - 1 && (
              <div className="w-px h-12 bg-gray-300" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
