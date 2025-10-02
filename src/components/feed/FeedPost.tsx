import React from "react";
import { Heart, MessageCircle, Share, MoreHorizontal, Camera, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GearListing } from "./GearListing";

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

interface Post {
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

interface FeedPostProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onMore: (postId: string) => void;
}

export function FeedPost({ post, onLike, onComment, onShare, onMore }: FeedPostProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{post.author.name}</h3>
              <div className="flex items-center gap-2">
                {post.author.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{post.author.location}</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground">{post.timestamp}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onMore(post.id)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Post Image Placeholder */}
        <div className="aspect-square bg-muted flex items-center justify-center">
          <Camera className="h-12 w-12 text-muted-foreground" />
        </div>
        
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
            <p className="text-sm">
              <span className="font-semibold">{post.author.name}</span> {post.content}
            </p>
            <div className="flex flex-wrap gap-1">
              {post.hashtags.map((hashtag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {hashtag}
                </Badge>
              ))}
            </div>
            
            {/* Gear Listings */}
            {post.gearUsed && post.gearUsed.length > 0 && (
              <GearListing gear={post.gearUsed} />
            )}
            
            <p className="text-xs text-muted-foreground">View all {post.comments} comments</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
