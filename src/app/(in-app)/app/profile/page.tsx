"use client";
import React, { useState } from "react";
import { User, Camera, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GearTabContent } from "@/components/profile/GearTabContent";
import { PostsTabContent } from "@/components/profile/PostsTabContent";
import { SavedTabContent } from "@/components/profile/SavedTabContent";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { VerificationCTA } from "@/components/profile/VerificationCTA";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { SettingsModal } from "@/components/profile/SettingsModal";
import useUser from "@/lib/users/useUser";
import { signOut } from "next-auth/react";
// import useCurrentPlan from "@/lib/users/useCurrentPlan"; // TODO: Use for plan-specific features
// import { ProfileFormData } from "@/lib/validations/profile.schema"; // TODO: Use for form validation

export default function ProfilePage() {
  const { user, isLoading: userLoading, error: userError } = useUser();
  // const { currentPlan } = useCurrentPlan(); // TODO: Use for plan-specific features
  
  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (userLoading) {
    return <ProfileSkeleton />;
  }

  if (userError || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-destructive/10 p-6 mb-4">
          <User className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Error loading profile</h3>
        <p className="text-muted-foreground max-w-sm">
          There was an error loading your profile information. Please try again.
        </p>
      </div>
    );
  }

  // Generate initials from name or email
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

  // Check if user has verified email
  const isEmailVerified = !!user.emailVerified;

  // Event handlers
  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleSaveProfile = () => {
    // Profile is already saved by the modal, this is just for any additional handling
    // User data will be automatically refreshed by the useProfileUpdate hook
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Profile Header - Dashboard Style */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 ring-4 ring-blue-200">
          <AvatarImage src={user.image || undefined} />
          <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {getInitials(user.name, user.email)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Profile Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name?.split(' ')[0] || 'User'}</p>
        </div>
        <div className="flex gap-2">
          <ProfileDropdown
            onEditProfile={handleEditProfile}
            onSettings={handleSettings}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <ProfileStats />

      {/* Verification CTA */}
      <VerificationCTA isEmailVerified={isEmailVerified} />

      {/* Tabbed Content */}
      <Tabs defaultValue="gear" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="gear" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Gear
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gear" className="mt-6">
          <GearTabContent />
        </TabsContent>

        <TabsContent value="posts" className="mt-6">
          <PostsTabContent />
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <SavedTabContent />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onEditProfile={handleEditProfile}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
