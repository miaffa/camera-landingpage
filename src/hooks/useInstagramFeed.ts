"use client";

import { useState, useEffect, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface Location {
  lat: number;
  lng: number;
}

interface Post {
  id: string;
  user_id: string;
  caption: string | null;
  location: string | null;
  imageUrl: string;
  imageAlt: string | null;
  createdAt: string;
  profile_username: string;
  profile_full_name: string | null;
  profile_avatar_url: string | null;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  gear_used?: Array<{
    id: string;
    name: string;
    type: string;
    rental_price?: number;
    is_available: boolean;
  }>;
}

interface UseInstagramFeedOptions {
  location?: Location;
  limit?: number;
}

interface UseInstagramFeedReturn {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  refresh: () => void;
  loadMore: () => void;
}

const POSTS_PER_PAGE = 10;

export function useInstagramFeed(options?: UseInstagramFeedOptions): UseInstagramFeedReturn {
  const [error, setError] = useState<Error | null>(null);
  const supabase = supabaseBrowser();

  // Create a stable key for SWR
  const getKey = (pageIndex: number, previousPageData: unknown) => {
    // If we've reached the end, return null
    const prevData = previousPageData as { data?: unknown[] } | null;
    if (previousPageData && (!prevData?.data || prevData.data.length === 0)) {
      return null;
    }
    
    // Return the key for this page
    return `posts-${pageIndex}-${options?.location ? `${options.location.lat},${options.location.lng}` : 'all'}`;
  };

  // Fetcher function for SWR
  const fetcher = async (key: string) => {
    try {
      console.log('Fetching posts with key:', key);
      
      const [, pageIndex] = key.split('-');
      const page = parseInt(pageIndex);
      const offset = page * POSTS_PER_PAGE;

      // Development mode - return mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - returning mock posts');
        
        const mockPosts: Post[] = [
          {
            id: `post-${page}-1`,
            user_id: 'user-1',
            caption: 'Golden hour magic ✨ Shot with my Canon EOS R5 and 24-70mm lens. Available for rent!',
            location: 'Louisville, KY',
            imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa77bb78b3b?w=500&h=500&fit=crop',
            imageAlt: 'Golden hour portrait',
            createdAt: new Date().toISOString(),
            profile_username: 'sarah_photo',
            profile_full_name: 'Sarah Johnson',
            profile_avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            likes_count: 42,
            comments_count: 8,
            is_liked: false,
            is_bookmarked: false,
            gear_used: [
              {
                id: 'gear-1',
                name: 'Canon EOS R5',
                type: 'Camera',
                rental_price: 150,
                is_available: true,
              },
              {
                id: 'gear-2',
                name: '24-70mm f/2.8',
                type: 'Lens',
                rental_price: 75,
                is_available: true,
              },
            ],
          },
          {
            id: `post-${page}-2`,
            user_id: 'user-2',
            caption: 'Street photography session downtown. Love the energy of the city!',
            location: 'Nashville, TN',
            imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop',
            imageAlt: 'Street photography',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            profile_username: 'mike_visuals',
            profile_full_name: 'Mike Chen',
            profile_avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            likes_count: 28,
            comments_count: 5,
            is_liked: true,
            is_bookmarked: false,
            gear_used: [
              {
                id: 'gear-3',
                name: 'Sony A7R IV',
                type: 'Camera',
                rental_price: 120,
                is_available: false,
              },
              {
                id: 'gear-4',
                name: '35mm f/1.4',
                type: 'Lens',
                rental_price: 60,
                is_available: true,
              },
            ],
          },
          {
            id: `post-${page}-3`,
            user_id: 'user-3',
            caption: 'Drone footage from the mountains. The DJI Mavic 3 Pro never disappoints!',
            location: 'Denver, CO',
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
            imageAlt: 'Mountain drone shot',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            profile_username: 'alex_drone',
            profile_full_name: 'Alex Rodriguez',
            profile_avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            likes_count: 156,
            comments_count: 23,
            is_liked: false,
            is_bookmarked: true,
            gear_used: [
              {
                id: 'gear-5',
                name: 'DJI Mavic 3 Pro',
                type: 'Drone',
                rental_price: 200,
                is_available: true,
              },
            ],
          },
        ];

        // Simulate pagination
        const startIndex = page * 2; // Show 2 posts per page for demo
        const endIndex = startIndex + 2;
        const pagePosts = mockPosts.slice(startIndex, endIndex);

        return {
          data: pagePosts,
          hasMore: page < 2, // Show 3 pages total
        };
      }

      // Production mode - use Supabase
      const query = supabase
        .from('posts')
        .select(`
          id,
          user_id,
          caption,
          location,
          image_url,
          image_alt,
          created_at,
          users!inner(
            id,
            name,
            email,
            image
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + POSTS_PER_PAGE - 1);

      // Add location filter if provided
      if (options?.location) {
        // TODO: Implement location-based filtering
        console.log('Location filtering not implemented yet');
      }

      const { data: posts, error: postsError } = await query;

      if (postsError) {
        throw postsError;
      }

      if (!posts) {
        return { data: [], hasMore: false };
      }

      // Get additional data for each post
      const enrichedPosts = await Promise.all(
        (posts as Record<string, unknown>[]).map(async (post: Record<string, unknown>) => {
          // Get likes count
          const { count: likesCount } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('post_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
            .eq('is_active', true);

          // Check if current user has liked/bookmarked this post
          const { data: currentUser } = await supabase.auth.getUser();
          let isLiked = false;
          let isBookmarked = false;

          if (currentUser.user) {
            const { data: likeData } = await supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', currentUser.user.id)
              .single();

            const { data: bookmarkData } = await supabase
              .from('post_bookmarks')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', currentUser.user.id)
              .single();

            isLiked = !!likeData;
            isBookmarked = !!bookmarkData;
          }

          // Get gear used (if any)
          const { data: gearData } = await supabase
            .from('post_gear')
            .select(`
              gear_id,
              gear!inner(
                id,
                name,
                type,
                rental_price,
                is_available
              )
            `)
            .eq('post_id', post.id);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const gearUsed = gearData?.map((item: any) => ({
            id: item.gear.id,
            name: item.gear.name,
            type: item.gear.type,
            rental_price: item.gear.rental_price,
            is_available: item.gear.is_available,
          })) || [];

          return {
            id: post.id,
            user_id: post.user_id,
            caption: post.caption,
            location: post.location,
            imageUrl: post.image_url,
            imageAlt: post.image_alt,
            createdAt: post.created_at,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            profile_username: (post.users as any).email.split('@')[0], // Use email prefix as username for now
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            profile_full_name: (post.users as any).name,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            profile_avatar_url: (post.users as any).image,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            is_liked: isLiked,
            is_bookmarked: isBookmarked,
            gear_used: gearUsed,
          };
        })
      );

      return {
        data: enrichedPosts,
        hasMore: posts.length === POSTS_PER_PAGE,
      };
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err as Error);
      throw err;
    }
  };

  const {
    data,
    error: swrError,
    isLoading,
    isValidating,
    mutate,
    size,
    setSize,
  } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });

  // Flatten all posts from all pages
  const posts = data ? data.flatMap(page => page.data as Post[]) : [];
  const isLoadingMore = isValidating && size > 1;
  const hasMore = data ? data[data.length - 1]?.hasMore : false;

  const refresh = useCallback(async () => {
    console.log('Refreshing feed...');
    setError(null);
    await mutate();
  }, [mutate]);

  const loadMore = useCallback(() => {
    console.log('Loading more posts...');
    if (!isLoadingMore && hasMore) {
      setSize(size + 1);
    }
  }, [isLoadingMore, hasMore, setSize, size]);

  // Handle errors
  useEffect(() => {
    if (swrError) {
      setError(swrError);
    }
  }, [swrError]);

  return {
    posts,
    isLoading: isLoading && !data,
    isLoadingMore,
    hasMore: hasMore || false,
    error: error || swrError,
    refresh,
    loadMore,
  };
}
