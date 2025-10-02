import { useState } from "react";
import useSWR from "swr";
import { CreatePostData, PostCreateResponse } from "@/lib/types/index";

export function usePostCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useSWR("/api/app/posts"); // To revalidate posts after creation

  const clearError = () => setError(null);

  const createPost = async (postData: CreatePostData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("content", postData.content);
      if (postData.location) {
        formData.append("location", postData.location);
      }
      formData.append("taggedUsers", JSON.stringify(postData.taggedUsers));
      formData.append("taggedGear", JSON.stringify(postData.taggedGear));
      
      // Append image files
      postData.images.forEach((file, index) => {
        formData.append(`image${index}`, file);
      });

      const response = await fetch("/api/app/posts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      const result: PostCreateResponse = await response.json();
      
      // Revalidate posts data globally
      mutate();

      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPost, isLoading, error, clearError };
}
