"use client";

import useSWR from "swr";

interface SavedPost {
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
  // Save information
  savedAt: Date;
}

export function useSavedPosts(shouldLoad: boolean = true) {
  const { data: savedPosts, error, isLoading, mutate } = useSWR<SavedPost[]>(
    shouldLoad ? "/api/posts/saved" : null
  );

  return {
    savedPosts: savedPosts || [],
    isLoading,
    error,
    mutate,
  };
}
