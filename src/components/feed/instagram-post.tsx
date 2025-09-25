"use client";

import { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface InstagramPostProps {
  post: {
    id: string;
    user_id: string;
    caption: string | null;
    location: string | null;
    imageUrl: string;
    imageAlt: string | null;
    createdAt: string;
    profile_username: string;
    profile_full_name: string | null;
    profile_avatar_url: string | null;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    is_bookmarked: boolean;
    gear_used?: Array<{
      id: string;
      name: string;
      type: string;
      rental_price?: number;
      is_available: boolean;
    }>;
  };
  onCommentsClick: (postId: string) => void;
  onUserClick: (username: string) => void;
}

export default function InstagramPost({ post, onCommentsClick, onUserClick }: InstagramPostProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = async () => {
    // Optimistic update
    const newLiked = !isLiked;
    const newLikesCount = newLiked ? likesCount + 1 : likesCount - 1;
    
    setIsLiked(newLiked);
    setLikesCount(newLikesCount);

    try {
      // TODO: Implement like API call
      console.log('Liking post:', post.id, newLiked);
    } catch (error) {
      // Revert on error
      setIsLiked(!newLiked);
      setLikesCount(likesCount);
      console.error('Error liking post:', error);
    }
  };

  const handleBookmark = async () => {
    // Optimistic update
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);

    try {
      // TODO: Implement bookmark API call
      console.log('Bookmarking post:', post.id, newBookmarked);
    } catch (error) {
      // Revert on error
      setIsBookmarked(!newBookmarked);
      console.error('Error bookmarking post:', error);
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Sharing post:', post.id);
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-4 glass-card">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 cursor-pointer" onClick={() => onUserClick(post.profile_username)}>
            <AvatarImage src={post.profile_avatar_url || ''} alt={post.profile_username} />
            <AvatarFallback>
              {post.profile_username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <button
              onClick={() => onUserClick(post.profile_username)}
              className="font-semibold text-sm hover:opacity-70"
            >
              {post.profile_username}
            </button>
            {post.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="w-8 h-8 btn-glass">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.imageAlt || 'Post image'}
          className="w-full aspect-square object-cover"
        />
        
        {/* Gear overlay - show if gear is available for rent */}
        {post.gear_used && post.gear_used.length > 0 && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <Camera className="w-3 h-3 mr-1" />
              {post.gear_used.length} gear
            </Badge>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={`w-8 h-8 btn-glass ${isLiked ? 'text-accent' : 'text-foreground'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCommentsClick(post.id)}
            className="w-8 h-8 btn-glass text-foreground"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="w-8 h-8 btn-glass text-foreground"
          >
            <Share className="w-5 h-5" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmark}
          className={`w-8 h-8 btn-glass ${isBookmarked ? 'text-primary' : 'text-foreground'}`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Likes count */}
      {likesCount > 0 && (
        <div className="px-3 pb-2">
          <span className="font-semibold text-sm">{likesCount} likes</span>
        </div>
      )}

      {/* Caption */}
      {post.caption && (
        <div className="px-3 pb-2">
          <span className="text-sm">
            <button
              onClick={() => onUserClick(post.profile_username)}
              className="font-semibold hover:opacity-70"
            >
              {post.profile_username}
            </button>
            <span className="ml-2">{post.caption}</span>
          </span>
        </div>
      )}

      {/* Gear used section */}
      {post.gear_used && post.gear_used.length > 0 && (
        <div className="px-3 pb-2">
          <div className="flex flex-wrap gap-2">
            {post.gear_used.map((gear) => (
              <Badge
                key={gear.id}
                variant={gear.is_available ? "default" : "secondary"}
                className={`text-xs ${
                  gear.is_available 
                    ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {gear.name}
                {gear.is_available && gear.rental_price && (
                  <span className="ml-1">${gear.rental_price}/day</span>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Comments count */}
      {post.comments_count > 0 && (
        <div className="px-3 pb-2">
          <button
            onClick={() => onCommentsClick(post.id)}
            className="text-gray-500 text-sm hover:opacity-70"
          >
            View all {post.comments_count} comments
          </button>
        </div>
      )}

      {/* Timestamp */}
      <div className="px-3 pb-3">
        <span className="text-gray-500 text-xs">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </span>
      </div>
    </Card>
  );
}
