"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { performanceMonitor } from "@/lib/performance/monitor";

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

interface PostInteractions {
  liked: boolean;
  saved: boolean;
}

interface UserInteractions {
  [postId: string]: PostInteractions;
}

export function useFeedData() {
  // Start performance monitoring
  performanceMonitor.start('feed-data-load');
  
  // Load posts first with aggressive caching
  const { data: posts, error: postsError, isLoading: postsLoading } = useSWR<Post[]>("/api/posts", {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 180000, // 3 minutes - much longer cache
    refreshInterval: 0, // No automatic refresh
    errorRetryCount: 1, // Faster failure
    errorRetryInterval: 15000, // 15 seconds between retries
  });
  
  // Extract post IDs for interactions
  const postIds = useMemo(() => posts?.map(post => post.id) || [], [posts]);
  
  // Load user interactions in parallel (only when we have post IDs)
  const { data: interactions, error: interactionsError, isLoading: interactionsLoading } = useSWR<UserInteractions>(
    postIds && postIds.length > 0 ? `/api/posts/user-interactions?postIds=${postIds.join(",")}` : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 180000, // 3 minutes - much longer cache
      refreshInterval: 0, // No automatic refresh
      errorRetryCount: 1, // Faster failure
      errorRetryInterval: 15000, // 15 seconds between retries
    }
  );

  // Combined loading state
  const isLoading = postsLoading || (postIds && postIds.length > 0 && interactionsLoading);
  
  // Combined error state
  const error = postsError || interactionsError;

  // Performance logging in development
  if (process.env.NODE_ENV === 'development' && !isLoading && posts && posts.length > 0) {
    const loadTime = performanceMonitor.end('feed-data-load');
    console.log(`🚀 Feed Data Loaded: ${posts.length} posts, ${loadTime}ms`);
  }

  return {
    posts: posts || [],
    interactions: interactions || {},
    isLoading,
    error,
  };
}
