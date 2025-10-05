"use client";

import React, { useState } from "react";
import { Camera, Heart, MessageCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSavedPosts } from "@/lib/posts/useSavedPosts";
import { PostDetailModal } from "@/components/feed/PostDetailModal";
import { PostImageCarousel } from "@/components/feed/PostImageCarousel";
import { usePostInteractions } from "@/lib/posts/usePostInteractions";
import { useSession } from "next-auth/react";

function PostImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center`}>
        <div className="text-center">
          <Camera className="h-12 w-12 text-blue-400 mx-auto mb-2" />
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

export function SavedTabContent() {
  const { savedPosts, isLoading, mutate } = useSavedPosts();
  const { data: session } = useSession();
  const [viewingPost, setViewingPost] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-white border-0 shadow-sm overflow-hidden animate-pulse">
            <CardContent className="p-0">
              <div className="w-full h-32 bg-gray-200" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Heart className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved posts yet</h3>
        <p className="text-gray-600 text-center">
          Save posts you love by tapping the bookmark icon
        </p>
      </div>
    );
  }

  const handleViewPost = (post: any) => {
    setViewingPost(post);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingPost(null);
  };

  const handleUnsavePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Revalidate the saved posts data
        mutate();
      }
    } catch (error) {
      console.error("Error unsaving post:", error);
    }
  };

  // Transform database post to component format for PostDetailModal
  const transformPostForModal = (post: any) => ({
    id: post.id,
    authorId: post.authorId,
    content: post.content,
    images: post.images || [],
    location: post.location,
    taggedUsers: post.taggedUsers || [],
    taggedGear: post.taggedGear || [],
    likesCount: post.likesCount || 0,
    commentsCount: post.commentsCount || 0,
    sharesCount: post.sharesCount || 0,
    isPublic: post.isPublic,
    isArchived: post.isArchived,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    authorName: post.authorName,
    authorUsername: post.authorUsername,
    authorAvatar: post.authorAvatar,
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {savedPosts.map((post) => (
          <Card key={post.id} className="bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Post Image */}
              {post.images && post.images.length > 0 ? (
                <div 
                  className="relative cursor-pointer"
                  onClick={() => handleViewPost(transformPostForModal(post))}
                >
                  <PostImageCarousel 
                    images={post.images}
                    className="aspect-square"
                  />
                </div>
              ) : (
                <div 
                  className="w-full h-32 bg-gray-100 flex items-center justify-center cursor-pointer"
                  onClick={() => handleViewPost(transformPostForModal(post))}
                >
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
              )}

              {/* Post Info */}
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 line-clamp-2 mb-1">
                      {post.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {post.authorName || "Unknown User"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewPost(transformPostForModal(post))}>
                        View Post
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleUnsavePost(post.id)}
                        className="text-red-600"
                      >
                        Remove from Saved
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Post Stats */}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Post Detail Modal */}
      {viewingPost && (
        <PostDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          post={viewingPost}
          currentUserId={session?.user?.id || ""}
          onLike={() => {}} // Handled by the modal itself
          onComment={() => {}} // Handled by the modal itself
          onShare={() => {}} // Handled by the modal itself
          onMore={() => {}} // Handled by the modal itself
        />
      )}
    </>
  );
}
