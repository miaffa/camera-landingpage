"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreateHeader } from "@/components/create/CreateHeader";
import { PostCreationForm } from "@/components/create/PostCreationForm";
import { SegmentedControl } from "@/components/create/SegmentedControl";
import { GearListingView } from "@/components/create/GearListingView";
import { GearCreationModal } from "@/components/create/GearCreationModal";
import { usePostCreate } from "@/lib/posts/usePostCreate";
import { useGearCreate } from "@/lib/gear/useGearCreate";
import { useUserGear } from "@/lib/gear/useUserGear";
import { toast } from "sonner";
import { TaggedUser, TaggedGear } from "@/lib/types/index";

export default function CreatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("gear"); // "gear", "post", or "requests"
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);
  
  // Post creation state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([]);
  const [taggedGear, setTaggedGear] = useState<TaggedGear[]>([]);
  
  const { createPost, isLoading, error } = usePostCreate();
  const { createGear, isLoading: isGearLoading, error: gearError } = useGearCreate();
  const { mutate: refreshGear, isLoading: isGearDataLoading } = useUserGear();

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

  const handleAddGear = () => {
    setIsGearModalOpen(true);
  };

  const handleSaveGear = useCallback(async (gearData: any) => {
    try {
      await createGear(gearData);
      // Refresh the gear list
      refreshGear();
    } catch (err) {
      console.error("Failed to save gear:", err);
    }
  }, [createGear, refreshGear]);

  const tabOptions = [
    { value: "gear", label: "My Gear" },
    { value: "post", label: "New Post" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header */}
      <CreateHeader />

      {/* Segmented Control */}
      <SegmentedControl
        options={tabOptions}
        value={activeTab}
        onChange={setActiveTab}
      />

      {/* Content based on active tab */}
      {activeTab === "gear" ? (
        <GearListingView onAddGear={handleAddGear} />
      ) : (
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
      )}

      {/* Gear Creation Modal */}
      <GearCreationModal
        isOpen={isGearModalOpen}
        onClose={() => setIsGearModalOpen(false)}
        onSave={handleSaveGear}
      />
    </div>
  );
}
