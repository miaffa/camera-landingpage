"use client";

import { useState } from 'react';
import { Plus, Bell, MapPin, Heart, MessageCircle, Share, Bookmark, Home, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useSWR from 'swr';

// Types for API data
interface Post {
  id: string;
  caption: string | null;
  location: string | null;
  imageUrl: string;
  imageAlt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  gear: Array<{
    id: string;
    name: string;
    brand: string;
    model: string;
    dailyRate: string;
    condition: string;
  }>;
}

interface FeedResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Header Component
function FeedHeader() {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left side - Plus button */}
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        {/* Center - Title */}
        <h1 className="text-xl font-bold text-black">LensFlare</h1>
        
        {/* Right side - Bell button */}
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

// Post Card Component
function PostCard({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    const newLiked = !isLiked;
    const newLikesCount = newLiked ? likesCount + 1 : likesCount - 1;
    setIsLiked(newLiked);
    setLikesCount(newLikesCount);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      {/* Main Image */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.imageAlt || "Post image"}
          className="w-full aspect-square object-cover"
        />
      </div>

      {/* User Profile Section Below Image */}
      <div className="px-4 py-4 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.user.image || '/placeholder.svg'} alt={post.user.name || 'User'} />
              <AvatarFallback className="bg-gray-200">
                {post.user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-black text-sm">{post.user.name || 'Anonymous'}</div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{post.location || 'Location not specified'}</span>
              </div>
            </div>
          </div>
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 text-sm rounded-md font-medium"
          >
            Follow
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={`w-8 h-8 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-gray-600"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-gray-600"
          >
            <Share className="w-5 h-5" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmark}
          className={`w-8 h-8 ${isBookmarked ? 'text-blue-500' : 'text-gray-600'}`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Likes Count */}
      <div className="px-4 pb-2">
        <span className="font-semibold text-sm text-black">{likesCount} likes</span>
      </div>

      {/* Caption */}
      <div className="px-4 pb-2">
        <span className="text-sm text-black">
          <span className="font-semibold">{post.user.name || 'Anonymous'}</span> {post.caption || 'No caption'}
        </span>
      </div>

      {/* Comments Count */}
      <div className="px-4 pb-3">
        <button className="text-gray-500 text-sm hover:opacity-70">
          View all {post.comments} comments
        </button>
      </div>
    </div>
  );
}


// Main Social Feed Component
export default function SocialFeed() {
  const { data, error, isLoading } = useSWR<FeedResponse>('/api/feed');

  if (isLoading) {
    return (
      <div className="bg-white">
        <FeedHeader />
        <div className="pb-16 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading feed...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <FeedHeader />
        <div className="pb-16 flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load feed</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const posts = data?.posts || [];

  return (
    <div className="bg-white">
      <FeedHeader />
      
      <div className="pb-16">
        {posts.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Be the first to share something!</p>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
