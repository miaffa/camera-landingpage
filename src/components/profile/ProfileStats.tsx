import React from "react";
import { Camera, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockGearListings, mockPosts } from "@/lib/data/mock-data";

export function ProfileStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Active Gear Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-pink-50 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Camera className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Active Gear</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{mockGearListings.length}</div>
              <div className="text-xs text-gray-500">Ready to rent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-orange-50 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Star className="h-4 w-4 text-pink-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Rating</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">4.8</div>
              <div className="text-xs text-gray-500">12 reviews</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Card */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">{mockPosts.length}</div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
        </CardContent>
      </Card>

      {/* Rentals Card */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">47</div>
            <div className="text-xs text-gray-500">Rentals</div>
          </div>
        </CardContent>
      </Card>

      {/* Followers Card */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">1.2k</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Card */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">$2.4k</div>
            <div className="text-xs text-gray-500">Earnings</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
