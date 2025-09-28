"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, MapPin, Camera, MessageCircle, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UserProfileModalProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    userId: string;
  };
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  onClose: () => void;
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_following: boolean;
  gear_owned: Array<{
    id: string;
    name: string;
    type: string;
    rental_price: number;
    is_available: boolean;
    image_url: string | null;
  }>;
  recent_posts: Array<{
    id: string;
    imageUrl: string;
    caption: string | null;
    createdAt: string;
  }>;
}

export default function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const loadUserProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Implement user profile API
      console.log('Loading profile for user:', user.userId);
      
      // Mock data for now
      const mockProfile: UserProfile = {
        id: user.userId,
        username: user.username,
        full_name: user.name,
        avatar_url: user.avatar,
        bio: 'Professional photographer specializing in portrait and landscape photography. Available for gear rentals!',
        location: 'Louisville, KY',
        followers_count: 1250,
        following_count: 340,
        posts_count: 89,
        is_following: false,
        gear_owned: [
          {
            id: '1',
            name: 'Canon EOS R5',
            type: 'Camera Body',
            rental_price: 150,
            is_available: true,
            image_url: null,
          },
          {
            id: '2',
            name: 'Sony 24-70mm f/2.8 GM',
            type: 'Lens',
            rental_price: 75,
            is_available: true,
            image_url: null,
          },
          {
            id: '3',
            name: 'DJI Mavic 3 Pro',
            type: 'Drone',
            rental_price: 200,
            is_available: false,
            image_url: null,
          },
        ],
        recent_posts: [
          {
            id: '1',
            imageUrl: '/placeholder.jpg',
            caption: 'Golden hour portrait session',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            imageUrl: '/placeholder.jpg',
            caption: 'Cityscape from the rooftop',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          },
        ],
      };
      
      setProfile(mockProfile);
      setIsFollowing(mockProfile.is_following);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user.userId, user.avatar, user.name, user.username]);

  useEffect(() => {
    if (user.userId) {
      loadUserProfile();
    }
  }, [user.userId, loadUserProfile]);

  const handleFollow = async () => {
    try {
      // TODO: Implement follow API
      console.log('Following/unfollowing user:', user.userId);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleGearRental = (gearId: string) => {
    // TODO: Implement gear rental flow
    console.log('Renting gear:', gearId);
  };

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Profile</span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mx-auto" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!profile) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Profile</span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Profile not found</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Profile</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.username} />
              <AvatarFallback className="text-2xl">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-xl font-bold">{profile.full_name || profile.username}</h2>
              <p className="text-gray-500">@{profile.username}</p>
              {profile.bio && (
                <p className="text-sm mt-2">{profile.bio}</p>
              )}
              {profile.location && (
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="font-bold">{profile.posts_count}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{profile.followers_count}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{profile.following_count}</div>
                <div className="text-sm text-gray-500">Following</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                className="flex-1"
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button variant="outline" size="icon">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Gear Available for Rent */}
          {profile.gear_owned.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Gear Available for Rent
              </h3>
              <div className="space-y-2">
                {profile.gear_owned.map((gear) => (
                  <Card key={gear.id} className="p-3">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{gear.name}</div>
                          <div className="text-sm text-gray-500">{gear.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${gear.rental_price}/day</div>
                          <Badge variant={gear.is_available ? "default" : "secondary"}>
                            {gear.is_available ? 'Available' : 'Rented'}
                          </Badge>
                        </div>
                      </div>
                      {gear.is_available && (
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleGearRental(gear.id)}
                        >
                          Rent This Gear
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recent Posts */}
          {profile.recent_posts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Recent Posts</h3>
              <div className="grid grid-cols-2 gap-2">
                {profile.recent_posts.map((post) => (
                  <div key={post.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                    <Image
                      src={post.imageUrl}
                      alt={post.caption || 'Post'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
