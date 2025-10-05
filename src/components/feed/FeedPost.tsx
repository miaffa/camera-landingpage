import React from "react";
import { Heart, MessageCircle, Share, MoreHorizontal, MapPin, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostImageCarousel } from "./PostImageCarousel";
import { usePostInteractions } from "@/lib/posts/usePostInteractions";
import { PostGearDisplay } from "./PostGearDisplay";


interface Post {
  id: string;
  authorId: string;
  content: string;
  images: string[];
  location: string | null;
  taggedUsers: string[];
  taggedGear: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isPublic: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Author information
  authorName: string | null;
  authorUsername: string | null;
  authorAvatar: string | null;
}

interface FeedPostProps {
  post: Post;
  initialLiked?: boolean;
  initialSaved?: boolean;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onMore: (postId: string) => void;
}


export function FeedPost({ post, initialLiked = false, initialSaved = false, onComment, onShare, onMore }: FeedPostProps) {
  const { liked, saved, isLiking, isSaving, toggleLike, toggleSave } = usePostInteractions({
    postId: post.id,
    initialLiked,
    initialSaved,
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorAvatar || ""} />
              <AvatarFallback>
                {post.authorName ? post.authorName.split(' ').map(n => n[0]).join('') : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{post.authorName || "Unknown User"}</h3>
              <div className="flex items-center gap-2">
                {post.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{post.location}</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onMore(post.id)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Post Content */}
        <div className="px-4 pb-2">
          <p className="text-sm">{post.content}</p>
        </div>
        
        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <PostImageCarousel 
            images={post.images}
            className="border-b"
          />
        )}
        
        {/* Post Actions */}
        <div className="p-4 space-y-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleLike}
                disabled={isLiking}
              >
                <Heart 
                  className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onComment(post.id)}>
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onShare(post.id)}>
                <Share className="h-5 w-5" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={toggleSave}
              disabled={isSaving}
            >
              <Bookmark 
                className={`h-5 w-5 ${saved ? 'fill-blue-500 text-blue-500' : ''}`} 
              />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{post.likesCount} likes</span>
              <span>{post.commentsCount} comments</span>
              <span>{post.sharesCount} shares</span>
            </div>
            
            {post.commentsCount > 0 && (
              <p className="text-xs text-muted-foreground">View all {post.commentsCount} comments</p>
            )}
          </div>
        </div>

        {/* Linked Gear Display */}
        {post.taggedGear && post.taggedGear.length > 0 && (
          <div className="px-4 py-3">
            <PostGearDisplay 
              gearIds={post.taggedGear.filter(gearId => gearId && typeof gearId === 'string')}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
