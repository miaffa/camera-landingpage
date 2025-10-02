import React from "react";
import { FeedPost } from "./FeedPost";
import { mockPosts } from "@/lib/data/feed-data";

interface Author {
  name: string;
  username: string;
  avatar: string;
  location?: string;
}

interface GearItem {
  id: string;
  name: string;
  price: number;
  category: string;
  status: string;
  rating: number;
  image: string;
  location: string;
}

// interface Post {
  id: string;
  author: Author;
  timestamp: string;
  content: string;
  hashtags: string[];
  likes: number;
  comments: number;
  image: string;
  gearUsed?: GearItem[];
}

interface FeedPostsProps {
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onMore: (postId: string) => void;
}

export function FeedPosts({ onLike, onComment, onShare, onMore }: FeedPostsProps) {
  return (
    <div className="space-y-6">
      {mockPosts.map((post) => (
        <FeedPost
          key={post.id}
          post={post}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onMore={onMore}
        />
      ))}
    </div>
  );
}
