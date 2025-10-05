"use client";

import React from "react";
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
  // const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Get all comment IDs for fetching likes
  // const commentIds = useMemo(() => comments.map(comment => comment.id), [comments]);
  // const { likes: commentLikes } = useCommentLikes(commentIds);

  const handleCreateComment = async (content: string) => {
    try {
      await createComment(postId, content);
      onComment?.(postId);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleReply = () => {
    // setReplyingTo(parentCommentId);
  };

  // Organize comments into parent-child relationships
  const organizeComments = (comments: Comment[]) => {
    const commentMap = new Map<string, Comment & { replies: Comment[] }>();
    const rootComments: (Comment & { replies: Comment[] })[] = [];

    // First pass: create map with empty replies array
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into parent-child relationships
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parentCommentId) {
        // This is a reply - find the root parent
        let rootParent = commentMap.get(comment.parentCommentId);
        while (rootParent && rootParent.parentCommentId) {
          rootParent = commentMap.get(rootParent.parentCommentId);
        }
        
        if (rootParent) {
          rootParent.replies.push(commentWithReplies);
        }
      } else {
        // This is a root comment
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const organizedComments = organizeComments(comments);

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
      {organizedComments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-0">
          {organizedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              replies={comment.replies}
              onReply={handleReply}
              onCreateReply={createComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
