"use client";

import React, { useState } from "react";
import { useComments, useCreateComment, Comment } from "@/lib/posts/useComments";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { Loader2 } from "lucide-react";

interface CommentsListProps {
  postId: string;
  onComment?: (postId: string) => void;
}

export function CommentsList({ postId, onComment }: CommentsListProps) {
  const { comments, isLoading, error } = useComments(postId);
  const { createComment } = useCreateComment();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleCreateComment = async (content: string) => {
    try {
      await createComment(postId, content);
      onComment?.(postId);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleReply = (parentCommentId: string) => {
    setReplyingTo(parentCommentId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">Loading comments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">Failed to load comments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Comment Input */}
      <div className="border-t pt-4">
        <CommentInput
          onSubmit={handleCreateComment}
          placeholder="Write a comment..."
          submitText="Comment"
        />
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-0">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
