"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Camera, Plus, X, Loader2, Upload, MapPin, User, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagePreview } from "./ImagePreview";
import { TaggedUser, TaggedGear } from "@/lib/types/index";
import { mockUsers } from "@/lib/data/mock-data";
import { useGearSearch } from "@/lib/gear/useGearSearch";
import { usePostEdit } from "@/lib/posts/usePostEdit";
import { toast } from "sonner";

interface PostEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    content: string;
    location?: string;
    images: string[];
    taggedUsers: string[];
    taggedGear: string[];
  };
}

export function PostEditModal({ isOpen, onClose, post }: PostEditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [isGearSearchOpen, setIsGearSearchOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [gearSearchQuery, setGearSearchQuery] = useState("");

  // Fetch real gear data
  const { isLoading: isGearLoading, searchGear } = useGearSearch();

  // Form state
  const [description, setDescription] = useState(post.content);
  const [location, setLocation] = useState(post.location || "");
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([]);
  const [taggedGear, setTaggedGear] = useState<TaggedGear[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(post.images);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const { editPost, isLoading, error } = usePostEdit();

  // Initialize form data when post changes
  useEffect(() => {
    if (post) {
      setDescription(post.content);
      setLocation(post.location || "");
      setExistingImages(post.images);
      setRemovedImages([]);
      setSelectedImages([]);
      // TODO: Convert tagged user/gear IDs back to objects
      setTaggedUsers([]);
      setTaggedGear([]);
    }
  }, [post]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files]);
    }
  }, []);

  const handleUploadFromDevice = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    setExistingImages(prev => prev.filter((_, i) => i !== index));
    setRemovedImages(prev => [...prev, imageToRemove]);
  };

  const handleRemoveNewImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUserSelect = (user: TaggedUser) => {
    if (!taggedUsers.find(u => u.id === user.id)) {
      setTaggedUsers(prev => [...prev, user]);
    }
    setIsUserSearchOpen(false);
    setUserSearchQuery("");
  };

  const handleUserRemove = (userId: string) => {
    setTaggedUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleGearSelect = (gear: { id: string; name: string; pricePerDay: string; category: string; images?: string[] | null }) => {
    const taggedGearItem: TaggedGear = {
      id: gear.id,
      name: gear.name,
      price: parseFloat(gear.pricePerDay),
      category: gear.category,
      image: gear.images?.[0] || undefined,
    };
    
    if (!taggedGear.find(g => g.id === gear.id)) {
      setTaggedGear(prev => [...prev, taggedGearItem]);
    }
    setIsGearSearchOpen(false);
    setGearSearchQuery("");
  };

  const handleGearRemove = (gearId: string) => {
    setTaggedGear(prev => prev.filter(gear => gear.id !== gearId));
  };

  // Filter users and gear based on search query
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const filteredGear = searchGear(gearSearchQuery);

  const handleSave = async () => {
    try {
      await editPost(post.id, {
        content: description,
        location,
        taggedUsers,
        taggedGear,
        images: selectedImages,
        existingImages,
        removedImages,
      });
      
      toast.success("Post updated successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  const handleClose = () => {
    // Reset form data when closing
    setDescription(post.content);
    setLocation(post.location || "");
    setTaggedUsers([]);
    setTaggedGear([]);
    setSelectedImages([]);
    setExistingImages(post.images);
    setRemovedImages([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Image Upload Area */}
          <div className="space-y-4">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Current Images</h4>
                <div className="grid grid-cols-2 gap-4">
                  {existingImages.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveExistingImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {selectedImages.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">New Images</h4>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <ImagePreview images={selectedImages} onRemoveImage={handleRemoveNewImage} />
                </div>
              </div>
            )}
            
            {/* Add More Photos Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Photos
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem onClick={handleUploadFromDevice} disabled={isLoading}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload from Device
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Textarea
              placeholder="Share your shot and tag the gear you used..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
              disabled={isLoading}
            />
            <div className="text-right text-xs text-gray-500">
              {description.length}/500
            </div>
          </div>

          {/* Location Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Input
              placeholder="Where was this photo taken?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Tag Users Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4" />
              Tag People
            </label>
            
            <Popover open={isUserSearchOpen} onOpenChange={setIsUserSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isLoading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search for people to tag...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search users..."
                    value={userSearchQuery}
                    onValueChange={setUserSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {filteredUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => handleUserSelect(user)}
                          className="flex items-center gap-2"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Tagged Users Display */}
            {taggedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {taggedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                    {user.name}
                    <button
                      onClick={() => handleUserRemove(user.id)}
                      className="ml-1 hover:text-red-500"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tag Gear Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Link Gear Listings
            </label>
            
            <Popover open={isGearSearchOpen} onOpenChange={setIsGearSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isLoading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search for gear to link...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search gear..."
                    value={gearSearchQuery}
                    onValueChange={setGearSearchQuery}
                  />
                  <CommandList>
                    {isGearLoading ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Loading gear...
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No gear found.</CommandEmpty>
                        <CommandGroup>
                          {filteredGear.map((gear) => (
                            <CommandItem
                              key={gear.id}
                              onSelect={() => handleGearSelect(gear)}
                              className="flex items-center gap-2"
                            >
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                {gear.images && gear.images.length > 0 ? (
                                  <img
                                    src={gear.images[0]}
                                    alt={gear.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Camera className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{gear.name}</div>
                                <div className="text-sm text-gray-500">
                                  {gear.category} • ${parseFloat(gear.pricePerDay).toFixed(0)}/day
                                  {gear.ownerName && ` • by ${gear.ownerName}`}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Tagged Gear Display */}
            {taggedGear.length > 0 && (
              <div className="space-y-2">
                {taggedGear.map((gear) => (
                  <div key={gear.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {gear.image ? (
                        <img
                          src={gear.image}
                          alt={gear.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{gear.name}</div>
                      <div className="text-sm text-gray-500">
                        {gear.category} • ${gear.price}/day
                      </div>
                    </div>
                    <button
                      onClick={() => handleGearRemove(gear.id)}
                      className="text-gray-400 hover:text-red-500"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-black hover:bg-gray-800 text-white"
              disabled={!description.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Post"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
