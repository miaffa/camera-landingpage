"use client";

import React, { useState } from "react";
import { Camera, Heart, MessageCircle, Image as ImageIcon, Edit, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUserPosts } from "@/lib/posts/useUserPosts";
import { PostEditModal } from "@/components/create/PostEditModal";
import { PostDetailModal } from "@/components/feed/PostDetailModal";
import { useSession } from "next-auth/react";
import { Post } from "@/db/schema/posts";

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

export function PostsTabContent() {
  const { posts, isLoading } = useUserPosts();
  const { data: session } = useSession();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="aspect-square bg-white border-0 shadow-sm overflow-hidden animate-pulse">
            <CardContent className="p-0 h-full">
              <div className="w-full h-full bg-gray-200" />
            </CardContent>
          </Card>
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
    // Add missing properties that modals expect
    authorName: "User", // This would need to be joined from users table
    authorUsername: "username", // This would need to be joined from users table  
    authorAvatar: null, // This would need to be joined from users table
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
    console.log("Comment on post:", postId);
  };

  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
  };

  const handleMore = (postId: string) => {
    console.log("More options for post:", postId);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <Card key={post.id} className="aspect-square bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0 h-full">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center relative group overflow-hidden cursor-pointer" onClick={() => handleViewPost(post)}>
              {post.images && post.images.length > 0 ? (
                <div className="w-full h-full relative">
                  {/* Display first image */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    {post.images[0] ? (
                      <PostImage 
                        src={post.images[0]} 
                        alt="Post image" 
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  {post.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      +{post.images.length - 1}
                    </div>
                  )}
                </div>
              ) : (
                <Camera className="h-8 w-8 text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                
                {/* Edit button */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
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

                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 text-white text-xs">
                    <Heart className="h-3 w-3 fill-white" />
                    {post.likesCount}
                    <MessageCircle className="h-3 w-3" />
                    {post.commentsCount}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
