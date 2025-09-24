"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Camera, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { BottomNavigation } from "@/components/layout/bottom-navigation";

export default function CreatePostPage() {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    try {
      // TODO: Implement post creation API
      console.log("Creating post:", { caption, location, image: selectedImage });
      
      // For now, just show success message
      alert("Post created successfully! (This is a demo)");
      
      // Reset form
      setCaption("");
      setLocation("");
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/app" className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </Link>
        <h1 className="text-lg font-semibold">Create Post</h1>
        <div className="w-12" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Share Your Photography</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        Change Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" asChild>
                            <span>
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Select Photo
                            </span>
                          </Button>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Choose a photo to share with the community
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <label htmlFor="caption" className="text-sm font-medium">
                  Caption
                </label>
                <Textarea
                  id="caption"
                  placeholder="What's this photo about? What gear did you use?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location (optional)
                </label>
                <Input
                  id="location"
                  placeholder="Where was this taken?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!selectedImage}
              >
                Share Post
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Gear Linking Section - TODO: Implement */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Link Gear (Coming Soon)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Soon you'll be able to link camera gear to your posts, making them rentable!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
