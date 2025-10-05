"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, Share, MoreHorizontal, Camera, MapPin, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PostEditModal } from "@/components/create/PostEditModal";
import { usePostInteractions } from "@/lib/posts/usePostInteractions";
import { useUserInteractions } from "@/lib/posts/useUserInteractions";
import { CommentsList } from "./CommentsList";
import { PostGearDisplay } from "./PostGearDisplay";
import { DisplayPost } from "@/lib/types/posts";


// Using DisplayPost from shared types instead of local interface

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: DisplayPost | null;
  currentUserId?: string;
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

export function PostDetailModal({ 
  isOpen, 
  onClose, 
  post, 
  currentUserId,
  onComment, 
  onShare, 
  onMore 
}: PostDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Fetch user interactions for this post
  const { interactions } = useUserInteractions(post ? [post.id] : []);
  const userInteraction = interactions[post?.id || ""] || { liked: false, saved: false };
  
  // Use post interactions for like/save state management
  const { liked, isLiking, toggleLike } = usePostInteractions({
    postId: post?.id || "",
    initialLiked: userInteraction.liked,
    initialSaved: userInteraction.saved,
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

  const nextImage = () => {
    if (post?.images && post.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const prevImage = () => {
    if (post?.images && post.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
    }
  };

  const handleClose = () => {
    setCurrentImageIndex(0);
    onClose();
  };

  const handleEditPost = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  if (!post) return null;

  const isOwnPost = currentUserId === post.authorId;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-0">
            {/* Post Header */}
            <div className="px-4 pb-3">
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
                      <span className="text-xs text-muted-foreground">{formatDate(post.createdAt || new Date())}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isOwnPost && (
                      <DropdownMenuItem onClick={handleEditPost}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Post
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onMore(post.id)}>
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      More Options
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-2">
              <p className="text-sm">{post.content}</p>
            </div>
            
            {/* Post Images */}
            {post.images && post.images.length > 0 ? (
              <div className="relative">
                <div className="aspect-square bg-gray-100 flex items-center justify-center border-b relative overflow-hidden">
                  <PostImage 
                    src={post.images[currentImageIndex]} 
                    alt="Post image" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Image Navigation */}
                  {post.images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {currentImageIndex + 1} / {post.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Image Thumbnails */}
                {post.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {post.images.map((imageUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex
                            ? "border-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={imageUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

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
                    <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
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
              </div>
            </div>

            {/* Tagged Gear */}
            {post.taggedGear && post.taggedGear.length > 0 && (
              <div className="px-4 py-3">
                <PostGearDisplay 
                  gearIds={post.taggedGear.filter(gearId => gearId && typeof gearId === 'string')}
                />
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t">
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-4">Comments</h3>
                <CommentsList postId={post.id} onComment={onComment} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {isOwnPost && (
        <PostEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          post={{
            id: post.id,
            content: post.content,
            location: post.location || undefined,
            images: post.images,
            taggedUsers: post.taggedUsers || [],
            taggedGear: post.taggedGear || [],
          }}
        />
      )}
    </>
  );
}
