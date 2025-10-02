import { useState } from "react";
import { ProfileFormData } from "@/lib/validations/profile.schema";
import useSWR from "swr";

interface UseProfileUpdateReturn {
  updateProfile: (data: ProfileFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useProfileUpdate(): UseProfileUpdateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useSWR("/api/app/me"); // To revalidate user data after update

  const updateProfile = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);
      if (data.bio) formData.append("bio", data.bio);
      if (data.location) formData.append("location", data.location);
      if (data.image) formData.append("image", data.image);

      const response = await fetch("/api/app/profile", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error("Profile update failed");
      }

      // Revalidate user data globally
      mutate();
      
      console.log("Profile updated successfully:", result.user);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
  };
}
