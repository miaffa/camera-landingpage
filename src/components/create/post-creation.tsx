"use client";

import { useState, useRef } from 'react';
import { Camera, X, MapPin, Tag, Upload, User, ArrowLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

// Types
interface SelectedImage {
  file: File;
  preview: string;
  id: string;
}

interface Gear {
  id: string;
  name: string;
  brand: string;
  model: string;
  dailyRate: string;
  available: boolean;
}

interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
}

export default function PostCreation() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // Multi-step state
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [orderedImages, setOrderedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Post content
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [imageGear, setImageGear] = useState<Record<number, string[]>>({});
  
  // UI state
  const [isCreating, setIsCreating] = useState(false);
  const [showTagPeopleModal, setShowTagPeopleModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // const [isUploading, setIsUploading] = useState(false); // TODO: Implement upload functionality
  // const [showLocationSearch, setShowLocationSearch] = useState(false); // TODO: Implement location search

  // Fetch gear data
  const { data: gearData } = useSWR('/api/gear');
  const availableGear: Gear[] = gearData?.gear || [];

  // Mock users for tagging (in real app, this would come from API)
  const mockUsers: User[] = [
    { id: '1', username: '@alexphoto', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: '2', username: '@mayacaptures', name: 'Maya Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
    { id: '3', username: '@jordanshots', name: 'Jordan Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
  ];

  // Image handling functions
  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = 5 - selectedImages.length;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    const newImages: SelectedImage[] = [];

    for (const file of filesToProcess) {
      try {
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        const imageData: SelectedImage = {
          file,
          preview,
          id: crypto.randomUUID(),
        };
        
        newImages.push(imageData);
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing image file');
      }
    }

    if (newImages.length > 0) {
      setSelectedImages(prev => [...prev, ...newImages]);
      setOrderedImages(prev => [...prev, ...newImages.map(img => img.preview)]);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(files);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(files);
    }
  };

  const removeImage = (imageId: string) => {
    setSelectedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      setOrderedImages(updated.map(img => img.preview));
      return updated;
    });
  };

  // Step navigation
  const handleNext = () => {
    if (step < 5) {
      if (step === 3) {
        setCurrentImageIndex(0);
      }
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Gear linking functions
  const toggleGear = (gearId: string, imageIndex: number = currentImageIndex) => {
    const actualImageIndex = imageIndex ?? 0;
    
    setImageGear(prev => {
      const imageGearList = prev[actualImageIndex] || [];
      const updatedGear = imageGearList.includes(gearId)
        ? imageGearList.filter(id => id !== gearId)
        : [...imageGearList, gearId];
      
      return {
        ...prev,
        [actualImageIndex]: updatedGear
      };
    });
  };

  const getCurrentImageGear = () => {
    const actualImageIndex = currentImageIndex ?? 0;
    return imageGear[actualImageIndex] || [];
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const currentIndex = currentImageIndex || 0;
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentImageIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < orderedImages.length - 1) {
      setCurrentImageIndex(currentIndex + 1);
    }
  };

  // People tagging functions
  const toggleUser = (username: string) => {
    setTaggedUsers(prev => 
      prev.includes(username) 
        ? prev.filter(user => user !== username)
        : [...prev, username]
    );
  };

  // Post creation
  const handleCreatePost = async () => {
    if (selectedImages.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setIsCreating(true);
    try {
      // Upload images first
      const uploadPromises = selectedImages.map(async (imageData) => {
        const formData = new FormData();
        formData.append('file', imageData.file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.imageUrl;
      });

      const uploadedImageUrls = await Promise.all(uploadPromises);

      // Create post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption: caption || undefined,
          location: location || undefined,
          imageUrl: uploadedImageUrls[0], // Primary image
          images: uploadedImageUrls, // All images
          imageAlt: selectedImages[0]?.file.name,
          gearIds: Object.values(imageGear).flat(), // All linked gear
          taggedUsers: taggedUsers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Reset and redirect
      setStep(1);
      setSelectedImages([]);
      setOrderedImages([]);
      setCaption('');
      setLocation('');
      setTaggedUsers([]);
      setImageGear({});
      router.push('/app?tab=feed');
    } catch (error) {
      console.error('Create post error:', error);
      alert('Failed to create post');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          {step > 1 ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          
          <h1 className="text-xl font-bold text-black">
            {step === 1 && "Select Photos"}
            {step === 2 && "Arrange Photos"}
            {step === 3 && "Add Details"}
            {step === 4 && "Tag & Link Gear"}
            {step === 5 && "Review & Publish"}
          </h1>
          
          <div className="flex items-center gap-2">
            {step === 1 && (
              <Button
                onClick={handleNext}
                disabled={selectedImages.length === 0}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm rounded-md font-medium"
              >
                Next ({selectedImages.length}/5)
              </Button>
            )}
            {step === 5 && (
              <Button
                onClick={handleCreatePost}
                disabled={isCreating}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm rounded-md font-medium"
              >
                {isCreating ? 'Creating...' : 'Publish'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Step 1: Select Photos */}
        {step === 1 && (
          <div className="p-4 space-y-6">
            {/* Upload Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-700"
                variant="outline"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload from Device
              </Button>
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-700"
                variant="outline"
              >
                <Camera className="h-5 w-5 mr-2" />
                Take Photo
              </Button>
            </div>

            {/* Selected Images Preview */}
            {selectedImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Selected Photos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedImages.map((imageData, index) => (
                    <div key={imageData.id} className="relative group">
                      <img
                        src={imageData.preview}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-purple-500"
                      />
                      <div className="absolute top-1 left-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {index + 1}
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeImage(imageData.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />
          </div>
        )}

        {/* Step 2: Arrange Photos */}
        {step === 2 && (
          <div className="p-4 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Arrange Your Photos</h3>
            <p className="text-sm text-gray-600">Drag to reorder your photos (optional)</p>
            
            <div className="grid grid-cols-2 gap-4">
              {orderedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleNext} className="w-full text-white">
              Next
            </Button>
          </div>
        )}

        {/* Step 3: Add Details */}
        {step === 3 && (
          <div className="p-4 space-y-6">
            {/* Image Preview */}
            <div className="w-full max-w-xs mx-auto">
              <img
                src={orderedImages[0]}
                alt="Post preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Caption</label>
              <Textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[100px] resize-none text-gray-900 placeholder:text-gray-500"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>

            <Button onClick={handleNext} className="w-full text-white">
              Next
            </Button>
          </div>
        )}

        {/* Step 4: Tag People & Link Gear */}
        {step === 4 && (
          <div className="p-4 space-y-6">
            {/* Image Navigation */}
            {orderedImages.length > 1 && (
              <div className="relative">
                <img
                  src={orderedImages[currentImageIndex] || orderedImages[0]}
                  alt={`Photo ${(currentImageIndex || 0) + 1}`}
                  className="w-32 h-32 mx-auto rounded-lg object-cover"
                />
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-bold">
                  Photo {(currentImageIndex || 0) + 1} of {orderedImages.length}
                </div>
                {orderedImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateImage('prev')}
                      disabled={(currentImageIndex || 0) === 0}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateImage('next')}
                      disabled={(currentImageIndex || 0) === orderedImages.length - 1}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Tag People */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-gray-700"
                onClick={() => setShowTagPeopleModal(true)}
              >
                <User className="h-4 w-4 mr-2" />
                Tag People {taggedUsers.length > 0 && `(${taggedUsers.length})`}
              </Button>
              {taggedUsers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {taggedUsers.map((username) => (
                    <Badge key={username} variant="secondary">
                      {username}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Link Gear */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Link Gear for This Photo</h3>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableGear.map((gear) => {
                  const currentGear = getCurrentImageGear();
                  const isSelected = currentGear.includes(gear.id);
                  
                  return (
                    <Card
                      key={gear.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        !gear.available ? "opacity-50 cursor-not-allowed" :
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => gear.available && toggleGear(gear.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{gear.name}</h4>
                          <p className="text-sm text-gray-600">{gear.brand} {gear.model}</p>
                          <p className="text-sm text-purple-600 font-medium">${gear.dailyRate}/day</p>
                        </div>
                        {gear.available && isSelected && (
                          <Check className="h-4 w-4 text-purple-500" />
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {getCurrentImageGear().length > 0 && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-sm font-medium text-purple-800 mb-2">
                    Selected for this photo:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {getCurrentImageGear().map(gearId => {
                      const gear = availableGear.find(g => g.id === gearId);
                      return gear ? (
                        <Badge key={gearId} variant="secondary" className="bg-purple-100 text-purple-800">
                          {gear.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button variant="outline" onClick={handleNext} className="w-full text-gray-700">
                Skip Gear Linking
              </Button>
              <Button onClick={handleNext} className="w-full text-white">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Review & Publish */}
        {step === 5 && (
          <div className="p-4 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Post</h3>
            
            {/* Image Preview */}
            <div className="w-full max-w-xs mx-auto">
              <img
                src={orderedImages[0]}
                alt="Post preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Post Details */}
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-sm mb-1">Photos</div>
                <p className="text-sm text-gray-600">{orderedImages.length} photo{orderedImages.length !== 1 ? 's' : ''}</p>
              </div>

              <div>
                <div className="font-semibold text-sm mb-1">Caption</div>
                <p className="text-sm text-gray-600">{caption || "No caption"}</p>
              </div>
              
              {location && (
                <div>
                  <div className="font-semibold text-sm mb-1">Location</div>
                  <p className="text-sm text-gray-600">{location}</p>
                </div>
              )}
              
              {taggedUsers.length > 0 && (
                <div>
                  <div className="font-semibold text-sm mb-1">Tagged People</div>
                  <p className="text-sm text-gray-600">{taggedUsers.join(", ")}</p>
                </div>
              )}
              
              {Object.keys(imageGear).length > 0 && (
                <div>
                  <div className="font-semibold text-sm mb-1">Linked Gear</div>
                  {Object.entries(imageGear).map(([imageIndex, gearIds]) => (
                    <div key={imageIndex} className="text-xs text-gray-600 mb-1">
                      Photo {parseInt(imageIndex) + 1}: {gearIds.length} item{gearIds.length !== 1 ? 's' : ''} linked
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tag People Modal */}
      <Dialog open={showTagPeopleModal} onOpenChange={setShowTagPeopleModal}>
        <DialogContent className="max-w-md mx-auto h-[70vh] p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <DialogTitle className="text-lg font-semibold text-gray-900">Tag People</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowTagPeopleModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-gray-900 placeholder:text-gray-500"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {mockUsers
                  .filter(user => 
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.username.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((user) => (
                    <Card
                      key={user.id}
                      className={`cursor-pointer transition-colors ${
                        taggedUsers.includes(user.username)
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleUser(user.username)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.username}</div>
                          </div>
                          {taggedUsers.includes(user.username) && (
                            <Check className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <Button onClick={() => setShowTagPeopleModal(false)} className="w-full text-white">
                Done ({taggedUsers.length} tagged)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}