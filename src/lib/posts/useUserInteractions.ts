"use client";

import useSWR from "swr";

interface PostInteractions {
  liked: boolean;
  saved: boolean;
}

interface UserInteractions {
  [postId: string]: PostInteractions;
}

export function useUserInteractions(postIds: string[]) {
  const { data, error, isLoading } = useSWR<UserInteractions>(
    postIds.length > 0 ? `/api/posts/user-interactions?postIds=${postIds.join(",")}` : null
  );

  return {
    interactions: data || {},
    isLoading,
    error,
  };
}
