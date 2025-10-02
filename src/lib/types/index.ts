// Shared types across the application
// Updated for production readiness

export interface TaggedUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface TaggedGear {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export interface Author {
  name: string;
  username: string;
  avatar: string;
  location?: string;
}

export interface GearItem {
  id: string;
  name: string;
  price: number;
  category: string;
  status: string;
  rating: number;
  image: string;
  location: string;
}

export interface Post {
  id: string;
  author: Author;
  timestamp: string;
  content: string;
  hashtags: string[];
  likes: number;
  comments: number;
  image: string;
  gearUsed?: GearItem[];
}

export interface CreatePostData {
  content: string;
  location?: string;
  taggedUsers: TaggedUser[];
  taggedGear: TaggedGear[];
  images: File[];
}

// API Response types
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PostCreateResponse {
  message: string;
  post: {
    id: string;
    authorId: string;
    content: string;
    images: string[] | null;
    location: string | null;
    taggedUsers: string[] | null;
    taggedGear: string[] | null;
    likesCount: number | null;
    commentsCount: number | null;
    sharesCount: number | null;
    isPublic: boolean | null;
    isArchived: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
}
