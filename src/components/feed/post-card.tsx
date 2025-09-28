"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  caption?: string;
  location?: string;
  imageUrl: string;
  imageAlt?: string;
  gear?: Array<{
    id: string;
    name: string;
    brand: string;
    model: string;
    dailyRate: number;
  }>;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikes(prev => data.liked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/bookmark`, {
        method: "POST",
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleShare = async () => {
    try {
      // TODO: Implement share functionality
      console.log("Sharing post:", post.id);
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* User Info Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{post.user.username}</p>
            <p className="text-sm text-gray-500">{post.location || "Location not set"}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Hide</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Image */}
      <div className="relative aspect-square">
        <Image
          src={post.imageUrl}
          alt={post.imageAlt || post.caption || "Post image"}
          fill
          className="object-cover"
        />
        
        {/* Gear Overlay - Show if gear is linked */}
        {post.gear && post.gear.length > 0 && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {post.gear.length} gear item{post.gear.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`p-2 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 text-gray-600">
            <MessageCircle className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="p-2 text-gray-600"
          >
            <Share className="w-6 h-6" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`p-2 ${isBookmarked ? 'text-blue-500' : 'text-gray-600'}`}
        >
          <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Likes Count */}
      <div className="px-4 pb-2">
        <p className="text-sm font-medium text-gray-900">
          {likes} like{likes !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-2">
          <p className="text-sm text-gray-900">
            <span className="font-medium">{post.user.username}</span> {post.caption}
          </p>
        </div>
      )}

      {/* Gear Section */}
      {post.gear && post.gear.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900 mb-2">Gear used in this shot:</p>
            <div className="space-y-2">
              {post.gear.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-md p-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.brand} {item.model}</p>
                    <p className="text-xs text-gray-500">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${item.dailyRate}/day</p>
                    <Button size="sm" className="text-xs">
                      Rent Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {post.comments > 0 && (
        <div className="px-4 pb-4">
          <button className="text-sm text-gray-500">
            View all {post.comments} comment{post.comments !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
