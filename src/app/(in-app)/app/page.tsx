"use client";
import React from "react";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { FeedPosts } from "@/components/feed/FeedPosts";

export default function HomePage() {

  const handlePostLike = () => {
    // TODO: Toggle like for post
    // Like functionality will be implemented in future iteration
  };

  const handlePostComment = () => {
    // TODO: Navigate to comments or open comment modal
    // Comment functionality will be implemented in future iteration
  };

  const handlePostShare = () => {
    // TODO: Open share modal
    // Share functionality will be implemented in future iteration
  };

  const handlePostMore = () => {
    // TODO: Open post options menu
    // More options functionality will be implemented in future iteration
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <FeedHeader />

      {/* Feed Posts */}
      <FeedPosts 
        onLike={handlePostLike}
        onComment={handlePostComment}
        onShare={handlePostShare}
        onMore={handlePostMore}
      />
    </div>
  );
}
