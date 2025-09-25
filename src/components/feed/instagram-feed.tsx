"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { RefreshCw, Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInstagramFeed } from '@/hooks/useInstagramFeed';
import { useLocation } from '@/hooks/useLocation';
import { useNotifications } from '@/hooks/useNotifications';
import InstagramPost from './instagram-post';
import PostCreation from './post-creation';
import CommentsModal from './comments-modal';
import UserProfileModal from './user-profile-modal';

// Feed Header Component
function FeedHeader({ 
  onCreatePost, 
  unreadCount 
}: { 
  onCreatePost: () => void; 
  unreadCount: number; 
}) {
  return (
    <div className="sticky top-0 z-10 glass-nav">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold font-display">LensFlare</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCreatePost}
            className="w-8 h-8 btn-glass"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 relative btn-glass"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton Component
function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-full max-w-md mx-auto glass-card">
          <div className="p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                <div className="h-3 bg-muted rounded w-32 animate-pulse" />
              </div>
            </div>
            <div className="aspect-square bg-muted rounded-lg animate-pulse mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Error State Component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h3 className="text-xl font-bold mb-4 font-display">Unable to Load Posts</h3>
      <p className="text-muted-foreground text-center mb-6">
        There was an issue loading the posts. Please check your connection and try again.
      </p>
      <Button onClick={onRetry} className="rounded-full btn-primary-glass px-8">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}

// Empty State Component
function EmptyState({ onCreatePost }: { onCreatePost: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Plus className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2 font-display">No Posts Yet</h3>
      <p className="text-muted-foreground text-center mb-6">
        Start exploring the photography community by following other creators or sharing your first post.
      </p>
      <Button
        onClick={onCreatePost}
        className="rounded-full btn-primary-glass px-8"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Post
      </Button>
    </div>
  );
}

// Loading More Indicator Component
function LoadingMoreIndicator() {
  return (
    <div className="flex justify-center py-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading more posts...</span>
      </div>
    </div>
  );
}

// End of Feed Component
function EndOfFeed() {
  return (
    <div className="flex justify-center py-8">
      <div className="text-center text-muted-foreground">
        <div className="text-sm">You&apos;ve reached the end!</div>
        <div className="text-xs mt-1">No more posts to load</div>
      </div>
    </div>
  );
}

// Main Instagram Feed Component
const InstagramFeed = () => {
  const [showPostCreation, setShowPostCreation] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; username: string; avatar: string; userId: string } | null>(null);
  
  const { location: userLocation } = useLocation();
  const { unreadCount } = useNotifications();
  
  // Feed data with location-based filtering
  const { 
    posts, 
    isLoading, 
    isLoadingMore, 
    hasMore, 
    error, 
    refresh, 
    loadMore 
  } = useInstagramFeed(
    userLocation ? { 
      location: { 
        lat: userLocation.latitude, 
        lng: userLocation.longitude 
      } 
    } : undefined
  );

  const feedRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Pull to refresh handler
  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // User click handler for profile modals
  const handleUserClick = useCallback((username: string) => {
    const post = posts.find(p => p.profile_username === username);
    if (post) {
      setSelectedUser({
        id: post.user_id,
        name: post.profile_full_name || post.profile_username || 'Unknown User',
        username: post.profile_username || 'unknown',
        avatar: post.profile_avatar_url || '/placeholder.svg',
        userId: post.user_id,
      });
    }
  }, [posts]);

  // Infinite scroll with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  // Error state
  if (error) {
    return <ErrorState onRetry={handleRefresh} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <FeedHeader 
        onCreatePost={() => setShowPostCreation(true)} 
        unreadCount={unreadCount} 
      />

      <div ref={feedRef} className="pb-20">
        {isLoading ? (
          <FeedSkeleton />
        ) : posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <InstagramPost
                key={post.id}
                post={post}
                onCommentsClick={setShowComments}
                onUserClick={handleUserClick}
              />
            ))}
            
            {isLoadingMore && <LoadingMoreIndicator />}
            {!hasMore && !isLoadingMore && <EndOfFeed />}
            
            {/* Intersection observer target */}
            <div ref={loadingRef} className="h-20" />
          </>
        ) : (
          <EmptyState onCreatePost={() => setShowPostCreation(true)} />
        )}
      </div>

      {/* Modals */}
      <PostCreation
        isOpen={showPostCreation}
        onClose={() => setShowPostCreation(false)}
        onPostPublished={() => {
          refresh();
          setShowPostCreation(false);
        }}
      />

      {showComments && (
        <CommentsModal
          postId={showComments}
          isOpen={!!showComments}
          onClose={() => setShowComments(null)}
          onUserClick={handleUserClick}
        />
      )}

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          userLocation={userLocation}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default InstagramFeed;