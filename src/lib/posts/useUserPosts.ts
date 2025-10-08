"use client";

import useSWR from "swr";
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

export function useUserPosts(shouldLoad: boolean = true) {
  const { data: session } = useSession();
  
  const fetcher = async (url: string): Promise<Post[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    const posts = await response.json();
    return posts;
  };

  const { data: posts, error, isLoading, mutate } = useSWR<Post[]>(
    session?.user?.id && shouldLoad ? "/api/app/posts" : null,
    fetcher
  );

  return {
    posts: posts || [],
    isLoading,
    error,
    mutate,
  };
}
