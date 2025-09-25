// Mock user data for development
export interface MockUser {
  id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  location: string;
  bio?: string;
  stats: {
    activeGear: number;
    rating: number;
    posts: number;
    rentals: number;
    followers: number;
  };
  plan: 'free' | 'pro' | 'premium';
  joinedDate: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'user-001',
    name: 'Sarah Chen',
    username: 'sarah_photography',
    email: 'sarah.chen@example.com',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    location: 'Louisville, KY',
    bio: 'Professional photographer specializing in weddings and portraits. Love sharing gear and connecting with fellow creatives!',
    stats: {
      activeGear: 3,
      rating: 4.8,
      posts: 12,
      rentals: 8,
      followers: 1247
    },
    plan: 'pro',
    joinedDate: '2024-01-15'
  },
  {
    id: 'user-002',
    name: 'Marcus Rodriguez',
    username: 'marcus_films',
    email: 'marcus.rodriguez@example.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: 'Nashville, TN',
    bio: 'Cinematographer and gear enthusiast. Always looking for the perfect shot and the right equipment.',
    stats: {
      activeGear: 5,
      rating: 4.9,
      posts: 8,
      rentals: 15,
      followers: 892
    },
    plan: 'premium',
    joinedDate: '2023-11-22'
  },
  {
    id: 'user-003',
    name: 'Elena Petrov',
    username: 'elena_visuals',
    email: 'elena.petrov@example.com',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    location: 'Atlanta, GA',
    bio: 'Creative director and photographer. Passionate about visual storytelling and helping others create amazing content.',
    stats: {
      activeGear: 2,
      rating: 4.7,
      posts: 6,
      rentals: 3,
      followers: 567
    },
    plan: 'free',
    joinedDate: '2024-03-08'
  },
  {
    id: 'user-004',
    name: 'David Lee',
    username: 'david_gear',
    email: 'david.lee@example.com',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face',
    location: 'Austin, TX',
    bio: 'Gear collector and tech reviewer. Love testing new equipment and sharing honest reviews.',
    stats: {
      activeGear: 7,
      rating: 4.9,
      posts: 15,
      rentals: 22,
      followers: 2103
    },
    plan: 'premium',
    joinedDate: '2023-08-14'
  }
];

// Current user state (can be updated by user switcher)
let currentUserId = 'user-001';

// Get current mock user (can be updated by user switcher)
export function getCurrentMockUser(): MockUser {
  return mockUsers.find(user => user.id === currentUserId) || mockUsers[0];
}

// Set current user (for user switcher)
export function setCurrentMockUser(userId: string): void {
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    currentUserId = userId;
  }
}

// Get mock user by ID
export function getMockUserById(id: string): MockUser | undefined {
  return mockUsers.find(user => user.id === id);
}

// Get all mock users (for testing)
export function getAllMockUsers(): MockUser[] {
  return mockUsers;
}
