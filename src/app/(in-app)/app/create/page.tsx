"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateHeader } from "@/components/create/CreateHeader";
import { PostCreationForm } from "@/components/create/PostCreationForm";
import { usePostCreate } from "@/lib/posts/usePostCreate";
import { toast } from "sonner";
import { TaggedUser, TaggedGear } from "@/lib/types/index";

export default function CreatePage() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([]);
  const [taggedGear, setTaggedGear] = useState<TaggedGear[]>([]);
  
  const { createPost, isLoading, error } = usePostCreate();

  const handleImageSelect = (files: File[]) => {
    setSelectedImages(files);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSharePost = async () => {
    try {
      await createPost({
        content: description,
        location,
        taggedUsers,
        taggedGear,
        images: selectedImages,
      });
      
      // Reset form after successful post
      setDescription("");
      setLocation("");
      setTaggedUsers([]);
      setTaggedGear([]);
      setSelectedImages([]);
      
      toast.success("Post shared successfully!");
      
      // Navigate to home page after a short delay to show the success message
      setTimeout(() => {
        router.push("/app");
      }, 1000);
    } catch (err) {
      toast.error("Failed to share post. Please try again.");
      console.error("Post creation error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <CreateHeader />

      {/* Post Creation Form */}
      <PostCreationForm
        selectedImages={selectedImages}
        description={description}
        location={location}
        taggedUsers={taggedUsers}
        taggedGear={taggedGear}
        isLoading={isLoading}
        error={error}
        onImageSelect={handleImageSelect}
        onRemoveImage={handleRemoveImage}
        onDescriptionChange={setDescription}
        onLocationChange={setLocation}
        onTaggedUsersChange={setTaggedUsers}
        onTaggedGearChange={setTaggedGear}
        onSharePost={handleSharePost}
      />
    </div>
  );
}
