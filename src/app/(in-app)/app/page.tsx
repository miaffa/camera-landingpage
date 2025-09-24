"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PostCard } from "@/components/feed/post-card";
import { FeedSkeleton } from "@/components/feed/feed-skeleton";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import useUser from "@/lib/users/useUser";

export default function AppHomepage() {
  const { user, isLoading: userLoading } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/feed");
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
        } else {
          console.error("Failed to fetch posts");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      }
    };

    if (!userLoading) {
      fetchPosts();
    }
  }, [userLoading]);

  if (userLoading || isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <FeedSkeleton />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">LensFlare</h1>
        <div className="flex items-center gap-4">
          <Link href="/create" className="p-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Link>
          <button className="p-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0 15 0v5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">Be the first to share your photography!</p>
            <Link href="/create" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">
              Create Post
            </Link>
          </div>
        ) : (
          <div className="space-y-0">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}