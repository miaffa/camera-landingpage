"use client";

import React, { useState } from "react";
import { User, Camera, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedPosts } from "@/lib/posts/useSavedPosts";
import { useSavedGear } from "@/lib/gear/useSavedGear";
import { SavedTabContent } from "./SavedTabContent";
import { SavedGearTabContent } from "./SavedGearTabContent";

export function SavedContentGrid() {
  const { savedPosts, isLoading: postsLoading } = useSavedPosts();
  const { savedGear, isLoading: gearLoading } = useSavedGear();
  const [activeView, setActiveView] = useState<"grid" | "posts" | "gear">("grid");

  const handleBackToGrid = () => {
    setActiveView("grid");
  };

  const handleViewPosts = () => {
    setActiveView("posts");
  };

  const handleViewGear = () => {
    setActiveView("gear");
  };

  // If viewing specific content, show that instead of the grid
  if (activeView === "posts") {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToGrid}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Saved
          </Button>
          <h2 className="text-xl font-semibold">Saved Posts</h2>
        </div>
        <SavedTabContent />
      </div>
    );
  }

  if (activeView === "gear") {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToGrid}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Saved
          </Button>
          <h2 className="text-xl font-semibold">Saved Gear</h2>
        </div>
        <SavedGearTabContent />
      </div>
    );
  }

  // Show the grid view
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Saved Content</h2>
        <p className="text-gray-600">Organize and manage your saved posts and gear</p>
      </div>

      {/* Pinterest-style masonry grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {/* Saved Posts Card */}
        <div 
          className="break-inside-avoid group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          onClick={handleViewPosts}
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* Image Preview */}
            <div className="relative">
              {postsLoading ? (
                <div className="aspect-[4/5] bg-gray-200 animate-pulse" />
              ) : savedPosts.length > 0 ? (
                <div className="aspect-[4/5] relative">
                  {/* Show first post image or create a collage */}
                  {savedPosts[0]?.images && savedPosts[0].images.length > 0 ? (
                    <img
                      src={savedPosts[0].images[0]}
                      alt="Saved posts preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <Heart className="h-16 w-16 text-pink-400" />
                    </div>
                  )}
                  
                  {/* Overlay with count */}
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {savedPosts.length} posts
                  </div>
                  
                  {/* Additional post previews if available */}
                  {savedPosts.length > 1 && (
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {savedPosts.slice(1, 4).map((post, index) => (
                        <div key={post.id} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                          {post.images && post.images.length > 0 ? (
                            <img
                              src={post.images[0]}
                              alt={`Post ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <User className="h-3 w-3 text-gray-600" />
                            </div>
                          )}
                        </div>
                      ))}
                      {savedPosts.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center text-xs font-medium">
                          +{savedPosts.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/5] bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="h-16 w-16 text-pink-400 mx-auto mb-2" />
                    <p className="text-pink-600 font-medium">No saved posts yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">Saved Posts</h3>
              <p className="text-sm text-gray-600">
                {savedPosts.length === 0 ? "Start saving posts you love" : 
                 savedPosts.length === 1 ? "1 post saved" : 
                 `${savedPosts.length} posts saved`}
              </p>
            </div>
          </div>
        </div>

        {/* Saved Gear Card */}
        <div 
          className="break-inside-avoid group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          onClick={handleViewGear}
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* Image Preview */}
            <div className="relative">
              {gearLoading ? (
                <div className="aspect-[4/5] bg-gray-200 animate-pulse" />
              ) : savedGear.length > 0 ? (
                <div className="aspect-[4/5] relative">
                  {/* Show first gear image or create a collage */}
                  {savedGear[0]?.images && savedGear[0].images.length > 0 ? (
                    <img
                      src={savedGear[0].images[0]}
                      alt="Saved gear preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <Camera className="h-16 w-16 text-blue-400" />
                    </div>
                  )}
                  
                  {/* Overlay with count */}
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {savedGear.length} items
                  </div>
                  
                  {/* Additional gear previews if available */}
                  {savedGear.length > 1 && (
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {savedGear.slice(1, 4).map((gear, index) => (
                        <div key={gear.id} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                          {gear.images && gear.images.length > 0 ? (
                            <img
                              src={gear.images[0]}
                              alt={`Gear ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <Camera className="h-3 w-3 text-gray-600" />
                            </div>
                          )}
                        </div>
                      ))}
                      {savedGear.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center text-xs font-medium">
                          +{savedGear.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/5] bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-600 font-medium">No saved gear yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">Saved Gear</h3>
              <p className="text-sm text-gray-600">
                {savedGear.length === 0 ? "Start saving gear you want to rent" : 
                 savedGear.length === 1 ? "1 item saved" : 
                 `${savedGear.length} items saved`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
