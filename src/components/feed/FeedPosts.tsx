"use client";

import React from "react";
import { FeedPost } from "./FeedPost";
import { usePosts } from "@/lib/posts/usePosts";
import { useUserInteractions } from "@/lib/posts/useUserInteractions";

// interface Author {
//   name: string;
//   username: string;
//   avatar: string;
//   location?: string;
// }

// interface GearItem {
//   id: string;
//   name: string;
//   price: number;
//   category: string;
//   status: string;
//   rating: number;
//   image: string;
//   location: string;
// }

// interface Post {
//   id: string;
//   author: Author;
//   timestamp: string;
//   content: string;
//   hashtags: string[];
//   likes: number;
//   comments: number;
//   image: string;
//   gearUsed?: GearItem[];
// }

interface FeedPostsProps {
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onMore: (postId: string) => void;
}

export function FeedPosts({ onComment, onShare, onMore }: FeedPostsProps) {
  const { posts, isLoading } = usePosts();
  const postIds = posts.map(post => post.id);
  const { interactions } = useUserInteractions(postIds);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="h-48 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-600">Be the first to share something with the community!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const userInteraction = interactions[post.id] || { liked: false, saved: false };
        return (
          <FeedPost
            key={post.id}
            post={post}
            initialLiked={userInteraction.liked}
            initialSaved={userInteraction.saved}
            onComment={onComment}
            onShare={onShare}
            onMore={onMore}
          />
        );
      })}
    </div>
  );
}
