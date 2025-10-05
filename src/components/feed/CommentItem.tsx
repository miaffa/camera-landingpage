"use client";

import React, { useState } from "react";
import { Heart, MoreHorizontal, Edit, Trash2, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { useDeleteComment, useUpdateComment, useCreateComment, useCommentLike, Comment } from "@/lib/posts/useComments";
import { CommentInput } from "@/components/feed/CommentInput";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  replies?: Comment[];
  onReply?: (parentCommentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onCreateReply?: (postId: string, content: string, parentCommentId?: string) => Promise<Comment>;
  isReply?: boolean;
}

export function CommentItem({ comment, postId, replies = [], onReply, onEdit, onCreateReply, isReply = false }: CommentItemProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const { deleteComment } = useDeleteComment();
  const { updateComment } = useUpdateComment();
  const { createComment: fallbackCreateComment } = useCreateComment();
  const { isLiked, isLoading: isLikeLoading, toggleLike } = useCommentLike(comment.id);
  
  // Use the passed createComment function or fallback to the hook
  const createComment = onCreateReply || fallbackCreateComment;

  const isOwnComment = session?.user?.id === comment.authorId;

  const formatDate = (date: Date | string) => {
    const now = new Date();
    const dateObj = new Date(date);
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return dateObj.toLocaleDateString();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(postId, comment.id);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleEdit = async (newContent: string) => {
    try {
      await updateComment(postId, comment.id, newContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleReply = () => {
    setIsReplying(true);
    onReply?.(comment.id);
  };

  const handleReplySubmit = async (content: string) => {
    try {
      await createComment(postId, content, comment.id);
      setIsReplying(false);
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };

  return (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex gap-3 py-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.authorAvatar || ""} />
          <AvatarFallback>
            {comment.authorName ? comment.authorName.split(' ').map(n => n[0]).join('') : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0 flex justify-between">
            <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{comment.authorName || "Unknown User"}</span>
              <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
              {new Date(comment.updatedAt).getTime() !== new Date(comment.createdAt).getTime() && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>
            
            {isEditing ? (
              <CommentInput
                initialValue={comment.content}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                placeholder="Edit your comment..."
                submitText="Update"
              />
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-900 break-words">{comment.content}</p>
                
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleReply}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  
                  {replies.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setShowReplies(!showReplies)}
                    >
                      {showReplies ? 'Hide' : 'View'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                    </Button>
                  )}
                  
                  {isOwnComment && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                          <Edit className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleDelete}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                {isReplying && (
                  <div className="mt-2">
                    <CommentInput
                      onSubmit={handleReplySubmit}
                      onCancel={() => setIsReplying(false)}
                      placeholder="Write a reply..."
                      submitText="Reply"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Heart button aligned to the right */}
          <div className="flex flex-col items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 hover:bg-transparent ${
                isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={toggleLike}
              disabled={isLikeLoading}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            {comment.likesCount > 0 && (
              <span className="text-xs text-muted-foreground">{comment.likesCount}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Replies */}
      {replies.length > 0 && showReplies && (
        <div className="ml-11 space-y-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReply={onReply}
              onEdit={onEdit}
              onCreateReply={onCreateReply}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
