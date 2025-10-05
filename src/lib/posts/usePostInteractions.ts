"use client";

import { useState, useCallback, useEffect } from "react";
import { mutate } from "swr";

interface PostInteractions {
  liked: boolean;
  saved: boolean;
}

interface UsePostInteractionsOptions {
  postId: string;
  initialLiked?: boolean;
  initialSaved?: boolean;
  onLikeChange?: (liked: boolean) => void;
  onSaveChange?: (saved: boolean) => void;
}

export function usePostInteractions({
  postId,
  initialLiked = false,
  initialSaved = false,
  onLikeChange,
  onSaveChange,
}: UsePostInteractionsOptions) {
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);

  // Sync internal state with initial values when they change
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const toggleLike = useCallback(async () => {
    if (isLiking) return;

    setIsLiking(true);
    const previousLiked = liked;

    // Optimistic update
    setLiked(!liked);
    onLikeChange?.(!liked);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: liked ? "DELETE" : "POST",
      });

      if (!response.ok) {
        // Revert on error
        setLiked(previousLiked);
        onLikeChange?.(previousLiked);
        throw new Error("Failed to toggle like");
      }

      // Revalidate posts data and user interactions
      mutate("/api/posts");
      mutate((key) => typeof key === "string" && key.startsWith("/api/posts/user-interactions"));
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      setLiked(previousLiked);
      onLikeChange?.(previousLiked);
    } finally {
      setIsLiking(false);
    }
  }, [postId, liked, isLiking, onLikeChange]);

  const toggleSave = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    const previousSaved = saved;

    // Optimistic update
    setSaved(!saved);
    onSaveChange?.(!saved);

    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: saved ? "DELETE" : "POST",
      });

      if (!response.ok) {
        // Revert on error
        setSaved(previousSaved);
        onSaveChange?.(previousSaved);
        throw new Error("Failed to toggle save");
      }

      // Revalidate posts data and user interactions
      mutate("/api/posts");
      mutate((key) => typeof key === "string" && key.startsWith("/api/posts/user-interactions"));
    } catch (error) {
      console.error("Error toggling save:", error);
      // Revert on error
      setSaved(previousSaved);
      onSaveChange?.(previousSaved);
    } finally {
      setIsSaving(false);
    }
  }, [postId, saved, isSaving, onSaveChange]);

  return {
    liked,
    saved,
    isLiking,
    isSaving,
    toggleLike,
    toggleSave,
  };
}
