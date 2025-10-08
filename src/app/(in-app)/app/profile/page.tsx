"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Camera, Bookmark, Star, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GearTabContent } from "@/components/profile/GearTabContent";
import { PostsTabContent } from "@/components/profile/PostsTabContent";
// import { SavedTabContent } from "@/components/profile/SavedTabContent";
import { SavedContentGrid } from "@/components/profile/SavedContentGrid";
import { LazyTabContent } from "@/components/profile/LazyTabContent";
import { CommentsBottomSheet } from "@/components/feed/CommentsBottomSheet";
// import { useUserPosts } from "@/lib/posts/useUserPosts";
import { ProfileStatsHybrid } from "@/components/profile/ProfileStatsHybrid";
import { VerificationCTA } from "@/components/profile/VerificationCTA";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { SettingsModal } from "@/components/profile/SettingsModal";
import useUser from "@/lib/users/useUser";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { PostWithAuthor } from "@/lib/types/posts";
// import useCurrentPlan from "@/lib/users/useCurrentPlan"; // TODO: Use for plan-specific features
// import { ProfileFormData } from "@/lib/validations/profile.schema"; // TODO: Use for form validation

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, isLoading: userLoading, error: userError } = useUser();
  // const { currentPlan } = useCurrentPlan(); // TODO: Use for plan-specific features
  
  // Modal states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [commentsPost, setCommentsPost] = useState<PostWithAuthor | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // Use session data for immediate display, then load additional user data
  const displayUser = user || (session?.user ? {
    id: session.user.id,
    name: (session.user as { name?: string }).name || null,
    email: session.user.email,
    image: (session.user as { image?: string }).image || null,
    emailVerified: null,
    stripeAccountId: (session.user as { stripeAccountId?: string }).stripeAccountId
  } : null);
  
  if (status === "loading" || (userLoading && !session?.user)) {
    return <ProfileSkeleton />;
  }

  if ((userError || !displayUser) && status === "authenticated") {
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
  const isEmailVerified = !!displayUser?.emailVerified;

  // Event handlers
  const handleEditProfile = () => {
    router.push("/app/profile/edit");
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


  const handlePostComment = () => {
    // This will be handled by the PostsTabContent component
    // We'll pass the post data directly from there
  };

  const handleCloseComments = () => {
    setIsCommentsOpen(false);
    setCommentsPost(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Profile Header - Dashboard Style */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 ring-4 ring-blue-200">
          <AvatarImage src={displayUser?.image || undefined} />
          <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {getInitials(displayUser?.name, displayUser?.email)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Profile Dashboard</h1>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-700">4.8</span>
            </div>
            {(displayUser as { stripeAccountId?: string })?.stripeAccountId && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
            )}
          </div>
          <p className="text-gray-600">Welcome back, {displayUser?.name?.split(' ')[0] || 'User'}</p>
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
      <ProfileStatsHybrid />

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
            <Bookmark className="h-4 w-4" />
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gear" className="mt-6">
          <LazyTabContent delay={200}>
            <GearTabContent />
          </LazyTabContent>
        </TabsContent>

        <TabsContent value="posts" className="mt-6">
          <LazyTabContent delay={200}>
            <PostsTabContent onComment={handlePostComment} />
          </LazyTabContent>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <LazyTabContent delay={200}>
            <SavedContentGrid />
          </LazyTabContent>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onEditProfile={handleEditProfile}
        onSignOut={handleSignOut}
      />

      {/* Comments Bottom Sheet */}
      <CommentsBottomSheet
        isOpen={isCommentsOpen}
        onClose={handleCloseComments}
        post={commentsPost}
        onComment={handlePostComment}
      />
    </div>
  );
}
