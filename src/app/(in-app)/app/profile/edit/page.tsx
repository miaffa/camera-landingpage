"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { profileSchema, ProfileFormData } from "@/lib/validations/profile.schema";
import { useProfileUpdate } from "@/lib/users/useProfileUpdate";
import { PhotoCropper } from "@/components/profile/PhotoCropper";
import useUser from "@/lib/users/useUser";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoading: userLoading, error: userError } = useUser();
  const [previewImage, setPreviewImage] = useState<string | null>(user?.image || null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const { updateProfile, isLoading, error } = useProfileUpdate();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.email?.split('@')[0] || "",
      bio: "",
      location: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL for cropping
      const reader = new FileReader();
      reader.onload = (e) => {
        setCroppingImage(e.target?.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    // Create a new File from the cropped blob
    const croppedFile = new File([croppedImageBlob], "cropped-avatar.jpg", {
      type: "image/jpeg",
    });
    
    // Set the cropped file in the form
    form.setValue("image", croppedFile);
    
    // Create preview URL for the cropped image
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(croppedImageBlob);
    
    // Close the cropper
    setIsCropping(false);
    setCroppingImage(null);
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setCroppingImage(null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      router.push("/app/profile");
    } catch (err) {
      // Error is handled by the hook and displayed in the UI
      console.error("Profile update failed:", err);
    }
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  // Show loading state while user data is being fetched
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if user data failed to load
  if (userError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Error loading profile</h3>
          <p className="text-gray-600 mb-4">There was an error loading your profile information.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Edit Profile</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Profile Photo Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewImage || undefined} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {getInitials(form.watch("name"), user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-3">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </label>
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500">
                    Click to upload a new profile photo
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself..."
                          className="min-h-[100px] resize-none"
                          maxLength={500}
                          {...field}
                        />
                      </FormControl>
                      <div className="text-right text-sm text-gray-500">
                        {field.value?.length || 0}/500
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pb-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isLoading}
                className="px-8"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Photo Cropper Modal */}
      {croppingImage && (
        <PhotoCropper
          imageSrc={croppingImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          isOpen={isCropping}
        />
      )}
    </div>
  );
}
