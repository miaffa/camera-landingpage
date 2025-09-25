"use client";

import { useState, useRef } from 'react';
import { X, Camera, Image as ImageIcon, MapPin, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PostCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onPostPublished: () => void;
}

export default function PostCreation({ isOpen, onClose, onPostPublished }: PostCreationProps) {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedGear, setSelectedGear] = useState<Array<{ id: string; name: string; type: string }>>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      toast.error("Please select an image");
      return;
    }

    setIsUploading(true);

    try {
      // TODO: Implement post creation API
      console.log("Creating post:", { 
        caption, 
        location, 
        image: selectedImage,
        gear: selectedGear
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Post created successfully!");
      onPostPublished();
      
      // Reset form
      setCaption("");
      setLocation("");
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedGear([]);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGearAdd = () => {
    // TODO: Implement gear selection modal
    console.log("Add gear clicked");
  };

  const handleGearRemove = (gearId: string) => {
    setSelectedGear(prev => prev.filter(gear => gear.id !== gearId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create Post</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4">
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
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
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
                        ref={fileInputRef}
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
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="location"
                  placeholder="Where was this taken?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Gear Used */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Gear Used (optional)</label>
              <div className="space-y-2">
                {selectedGear.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedGear.map((gear) => (
                      <Badge key={gear.id} variant="secondary" className="flex items-center gap-1">
                        {gear.name}
                        <button
                          type="button"
                          onClick={() => handleGearRemove(gear.id)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGearAdd}
                  className="w-full"
                >
                  <Hash className="w-4 h-4 mr-2" />
                  Add Gear Used
                </Button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <Button
              type="submit"
              className="w-full"
              disabled={!selectedImage || isUploading}
            >
              {isUploading ? 'Publishing...' : 'Share Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
