"use client";

import { useState } from "react";
import { mutate } from "swr";
import { CreatePostData, PostCreateResponse } from "@/lib/types/index";

export function usePostEdit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const editPost = async (postId: string, postData: CreatePostData & {
    existingImages: string[];
    removedImages: string[];
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("postId", postId);
      formData.append("content", postData.content);
      if (postData.location) {
        formData.append("location", postData.location);
      }
      formData.append("taggedUsers", JSON.stringify(postData.taggedUsers));
      formData.append("taggedGear", JSON.stringify(postData.taggedGear));
      formData.append("existingImages", JSON.stringify(postData.existingImages));
      formData.append("removedImages", JSON.stringify(postData.removedImages));
      
      // Append new image files
      postData.images.forEach((file, index) => {
        formData.append(`image${index}`, file);
      });

      const response = await fetch("/api/app/posts", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update post");
      }

      const result: PostCreateResponse = await response.json();
      
      // Revalidate posts data globally
      mutate("/api/app/posts");
      mutate("/api/posts"); // Also revalidate the main feed

      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { editPost, isLoading, error, clearError };
}
