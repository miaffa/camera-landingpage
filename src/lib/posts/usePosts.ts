"use client";

import useSWR from "swr";

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

export function usePosts() {
  const fetcher = async (url: string): Promise<Post[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return response.json();
  };

  const { data: posts, error, isLoading, mutate } = useSWR<Post[]>(
    "/api/posts",
    fetcher
  );

  return {
    posts: posts || [],
    isLoading,
    error,
    mutate,
  };
}
