// Shared Post types for the LensFlare application
// This file defines the different Post structures used throughout the app

import { Post as BasePost } from "@/db/schema/posts";

// Base Post type from database (no author information)
export type DatabasePost = BasePost;

// Post with author information (from API joins)
export interface PostWithAuthor extends DatabasePost {
  authorName: string | null;
  authorUsername: string | null;
  authorAvatar: string | null;
}

// Saved Post type (includes save timestamp)
export interface SavedPost extends PostWithAuthor {
  savedAt: Date;
}

// Post for display in components (transformed for UI)
export interface DisplayPost {
  id: string;
  authorId: string;
  content: string;
  images: string[];
  location?: string | null;
  taggedUsers?: string[];
  taggedGear?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isPublic: boolean | null;
  isArchived: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  authorName: string | null;
  authorUsername?: string | null;
  authorAvatar?: string | null;
}

// Type guards to check Post types
export function isPostWithAuthor(post: unknown): post is PostWithAuthor {
  return !!(post && typeof post === 'object' && post !== null && typeof (post as Record<string, unknown>).authorName === 'string');
}

export function isSavedPost(post: unknown): post is SavedPost {
  const postObj = post as Record<string, unknown>;
  return !!(post && typeof post === 'object' && post !== null && typeof postObj.savedAt === 'object' && postObj.savedAt instanceof Date);
}

export function isDisplayPost(post: unknown): post is DisplayPost {
  const postObj = post as Record<string, unknown>;
  return !!(post && typeof post === 'object' && post !== null && typeof postObj.id === 'string' && typeof postObj.content === 'string');
}
