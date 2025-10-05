"use client";

import useSWR from "swr";
import { mutate } from "swr";

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentCommentId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Author information
  authorName: string | null;
  authorUsername: string | null;
  authorAvatar: string | null;
}

export function useComments(postId: string) {
  const { data, error, isLoading, mutate } = useSWR<Comment[]>(
    postId ? `/api/posts/${postId}/comments` : null
  );

  return {
    comments: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useCreateComment() {
  const createComment = async (postId: string, content: string, parentCommentId?: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, parentCommentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      const newComment = await response.json();

      // Revalidate comments for this post
      mutate(`/api/posts/${postId}/comments`);
      
      // Revalidate posts to update comment count
      mutate("/api/posts");
      mutate((key) => typeof key === "string" && key.startsWith("/api/posts/user-interactions"));

      return newComment;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  };

  return { createComment };
}

export function useUpdateComment() {
  const updateComment = async (postId: string, commentId: string, content: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const updatedComment = await response.json();

      // Revalidate comments for this post
      mutate(`/api/posts/${postId}/comments`);

      return updatedComment;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  };

  return { updateComment };
}

export function useDeleteComment() {
  const deleteComment = async (postId: string, commentId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      // Revalidate comments for this post
      mutate(`/api/posts/${postId}/comments`);
      
      // Revalidate posts to update comment count
      mutate("/api/posts");
      mutate((key) => typeof key === "string" && key.startsWith("/api/posts/user-interactions"));

      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };

  return { deleteComment };
}
