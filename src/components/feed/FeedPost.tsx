import React, { useState } from "react";
import { Heart, MessageCircle, Share, MoreHorizontal, Camera, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


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
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onMore: (postId: string) => void;
}

function PostImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center`}>
        <div className="text-center">
          <Camera className="h-16 w-16 text-blue-400 mx-auto mb-2" />
          <p className="text-sm text-blue-600 font-medium">Photo Shared</p>
        </div>
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

export function FeedPost({ post, onLike, onComment, onShare, onMore }: FeedPostProps) {
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
        {post.images && post.images.length > 0 ? (
          <div className="aspect-square bg-gray-100 flex items-center justify-center border-b relative overflow-hidden">
            <PostImage 
              src={post.images[0]} 
              alt="Post image" 
              className="w-full h-full object-cover"
            />
            {post.images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                +{post.images.length - 1}
              </div>
            )}
          </div>
        ) : null}
        
        {/* Post Actions */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onLike(post.id)}>
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onComment(post.id)}>
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onShare(post.id)}>
                <Share className="h-5 w-5" />
              </Button>
            </div>
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
      </CardContent>
    </Card>
  );
}
