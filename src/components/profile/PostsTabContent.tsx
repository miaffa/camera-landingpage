"use client";

import React, { useState } from "react";
import { Camera, Heart, MessageCircle, Image as ImageIcon, Edit, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUserPosts } from "@/lib/posts/useUserPosts";
import { PostEditModal } from "@/components/create/PostEditModal";
import { PostDetailModal } from "@/components/feed/PostDetailModal";
import { useSession } from "next-auth/react";

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

interface PostsTabContentProps {
  onComment?: (postId: string) => void;
}

function PostImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center`}>
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-blue-400 mx-auto mb-2" />
          <p className="text-xs text-blue-600 font-medium">Image Uploaded</p>
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

export function PostsTabContent({ onComment }: PostsTabContentProps) {
  const { posts, isLoading } = useUserPosts();
  const { data: session } = useSession();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-sm overflow-hidden" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Camera className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-600 text-center">
          Share your photography and gear experiences with the community
        </p>
      </div>
    );
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
  };

  const handleViewPost = (post: Post) => {
    console.log("Viewing post:", post.id);
    setViewingPost(post);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingPost(null);
  };

  // Transform database post to component format for PostDetailModal
  const transformPostForDetail = (post: Post) => ({
    ...post,
    location: post.location,
    images: post.images || [],
    taggedUsers: post.taggedUsers || [],
    taggedGear: post.taggedGear || [],
    createdAt: post.createdAt || new Date(),
    updatedAt: post.updatedAt || new Date(),
    likesCount: post.likesCount || 0,
    commentsCount: post.commentsCount || 0,
    sharesCount: post.sharesCount || 0,
    isPublic: post.isPublic || true,
    isArchived: post.isArchived || false,
    // Use real author data from the API
    authorName: post.authorName || "Unknown User",
    authorUsername: post.authorUsername || "unknown",
    authorAvatar: post.authorAvatar || null,
  });

  // Transform database post to component format for PostEditModal
  const transformPostForEdit = (post: Post) => ({
    id: post.id,
    content: post.content,
    location: post.location || undefined,
    images: post.images || [],
    taggedUsers: post.taggedUsers || [],
    taggedGear: post.taggedGear || [],
  });

  // Mock handlers for post actions
  const handleLike = (postId: string) => {
    console.log("Like post:", postId);
  };

  const handleComment = (postId: string) => {
    onComment?.(postId);
  };

  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
  };

  const handleMore = (postId: string) => {
    console.log("More options for post:", postId);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <div key={post.id} className="aspect-square bg-gray-100 relative group overflow-hidden cursor-pointer rounded-sm" onClick={() => handleViewPost(post)}>
            {post.images && post.images.length > 0 ? (
              <div className="w-full h-full relative">
                {/* Display first image with proper cropping */}
                {post.images[0] ? (
                  <PostImage 
                    src={post.images[0]} 
                    alt="Post image" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {post.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    +{post.images.length - 1}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
              
            {/* Edit button */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleEditPost(post)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stats overlay */}
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 text-white text-xs">
                <Heart className="h-3 w-3 fill-white" />
                {post.likesCount}
                <MessageCircle className="h-3 w-3" />
                {post.commentsCount}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <PostEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          post={transformPostForEdit(editingPost)}
        />
      )}

      {/* Post Detail Modal */}
      {viewingPost && (
        <PostDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          post={transformPostForDetail(viewingPost)}
          currentUserId={session?.user?.id}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onMore={handleMore}
        />
      )}
    </>
  );
}
