"use client";
import React, { useState } from "react";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { FeedPosts } from "@/components/feed/FeedPosts";
import { PostDetailModal } from "@/components/feed/PostDetailModal";
import { CommentsBottomSheet } from "@/components/feed/CommentsBottomSheet";
import { usePosts } from "@/lib/posts/usePosts";
import { useSession } from "next-auth/react";
import { PostWithAuthor, DisplayPost } from "@/lib/types/posts";

export default function HomePage() {
  const { posts } = usePosts();
  const { data: session } = useSession();
  const [viewingPost, setViewingPost] = useState<DisplayPost | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [commentsPost, setCommentsPost] = useState<PostWithAuthor | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handlePostComment = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setCommentsPost(post);
      setIsCommentsOpen(true);
    }
  };

  const handlePostShare = () => {
    // TODO: Open share modal
    // Share functionality will be implemented in future iteration
  };

  const handlePostMore = () => {
    // TODO: Open post options menu
    // More options functionality will be implemented in future iteration
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingPost(null);
  };

  const handleCloseComments = () => {
    setIsCommentsOpen(false);
    setCommentsPost(null);
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-20">
        {/* Header */}
        <FeedHeader />

        {/* Feed Posts */}
        <FeedPosts 
          onComment={handlePostComment}
          onShare={handlePostShare}
          onMore={handlePostMore}
        />
      </div>

      {/* Post Detail Modal */}
      {viewingPost && (
        <PostDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          post={viewingPost}
          currentUserId={session?.user?.id}
          onLike={handlePostComment}
          onComment={handlePostComment}
          onShare={handlePostShare}
          onMore={handlePostMore}
        />
      )}

      {/* Comments Bottom Sheet */}
      <CommentsBottomSheet
        isOpen={isCommentsOpen}
        onClose={handleCloseComments}
        post={commentsPost}
        onComment={handlePostComment}
      />
    </>
  );
}
