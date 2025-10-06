import { useState } from "react";
import { ProfileFormData } from "@/lib/validations/profile.schema";
import useSWR from "swr";
import { uploadAvatarClient } from "@/lib/supabase/client-upload";

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
      // Handle avatar upload on client side first
      let imageUrl: string | null = null;
      if (data.image && data.image.size > 0) {
        try {
          // Get user ID from the current user data
          const userResponse = await fetch("/api/app/me");
          if (userResponse.ok) {
            const userData = await userResponse.json();
            const userId = userData.user?.id;
            if (userId) {
              console.log(`Uploading avatar for user ${userId}`);
              const uploadResult = await uploadAvatarClient(data.image, userId);
              imageUrl = uploadResult.url;
              console.log(`Avatar uploaded successfully: ${imageUrl}`);
            }
          }
        } catch (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          throw new Error(`Failed to upload avatar: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
        }
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);
      if (data.bio) formData.append("bio", data.bio);
      if (data.location) formData.append("location", data.location);
      // Send the image URL instead of the file
      if (imageUrl) formData.append("imageUrl", imageUrl);

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
