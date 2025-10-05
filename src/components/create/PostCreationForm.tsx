import React, { useRef, useState, useCallback, useMemo } from "react";
import { Camera, Plus, X, Loader2, Upload, MapPin, User, Search } from "lucide-react";
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
import { ImagePreview } from "./ImagePreview";
import { TaggedUser, TaggedGear } from "@/lib/types/index";
import { mockUsers } from "@/lib/data/mock-data";
import { useGearSearch } from "@/lib/gear/useGearSearch";

interface PostCreationFormProps {
  selectedImages: File[];
  description: string;
  location: string;
  taggedUsers: TaggedUser[];
  taggedGear: TaggedGear[];
  isLoading?: boolean;
  error?: string | null;
  onImageSelect: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  onDescriptionChange: (description: string) => void;
  onLocationChange: (location: string) => void;
  onTaggedUsersChange: (users: TaggedUser[]) => void;
  onTaggedGearChange: (gear: TaggedGear[]) => void;
  onSharePost: () => void;
}

function PostCreationForm({
  selectedImages,
  description,
  location,
  taggedUsers,
  taggedGear,
  isLoading = false,
  error = null,
  onImageSelect,
  onRemoveImage,
  onDescriptionChange,
  onLocationChange,
  onTaggedUsersChange,
  onTaggedGearChange,
  onSharePost
}: PostCreationFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [isGearSearchOpen, setIsGearSearchOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [gearSearchQuery, setGearSearchQuery] = useState("");

  // Fetch real gear data
  const { isLoading: isGearLoading, searchGear } = useGearSearch();


  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onImageSelect(files);
    }
  }, [onImageSelect]);

  const handleUploadFromDevice = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleTakePhoto = useCallback(() => {
    // TODO: Implement camera functionality
    // Camera functionality will be implemented in future iteration
  }, []);

  const handleUserSelect = (user: TaggedUser) => {
    if (!taggedUsers.find(u => u.id === user.id)) {
      onTaggedUsersChange([...taggedUsers, user]);
    }
    setIsUserSearchOpen(false);
    setUserSearchQuery("");
  };

  const handleUserRemove = (userId: string) => {
    onTaggedUsersChange(taggedUsers.filter(user => user.id !== userId));
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
      onTaggedGearChange([...taggedGear, taggedGearItem]);
    }
    setIsGearSearchOpen(false);
    setGearSearchQuery("");
  };

  const handleGearRemove = (gearId: string) => {
    onTaggedGearChange(taggedGear.filter(gear => gear.id !== gearId));
  };

  // Filter users and gear based on search query
  const filteredUsers = useMemo(() => 
    mockUsers.filter(user =>
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
    ), [userSearchQuery]
  );

  const filteredGear = useMemo(() => 
    searchGear(gearSearchQuery), [gearSearchQuery, searchGear]
  );

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Upload Area */}
      <div className="space-y-4">
        {selectedImages.length > 0 ? (
          <div className="space-y-3">
            {/* Image Preview Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <ImagePreview images={selectedImages} onRemoveImage={onRemoveImage} />
            </div>
            
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
                <DropdownMenuItem onClick={handleTakePhoto} disabled={isLoading}>
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="space-y-2">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500">Tap to add photo</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuItem onClick={handleUploadFromDevice} disabled={isLoading}>
                <Upload className="h-4 w-4 mr-2" />
                Upload from Device
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTakePhoto} disabled={isLoading}>
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        )}

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
          onChange={(e) => onDescriptionChange(e.target.value)}
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
          onChange={(e) => onLocationChange(e.target.value)}
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

      {/* Share Button */}
      <Button 
        onClick={onSharePost}
        className="w-full bg-black hover:bg-gray-800 text-white"
        disabled={selectedImages.length === 0 || !description.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sharing...
          </>
        ) : (
          "Share Post"
        )}
      </Button>
    </div>
  );
}

export { PostCreationForm };
