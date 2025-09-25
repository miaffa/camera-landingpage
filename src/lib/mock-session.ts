import { getCurrentMockUser } from './mock-users';

// Create a mock session with complete user data
export function createMockSession() {
  const mockUser = getCurrentMockUser();
  
  return {
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      image: mockUser.image,
      username: mockUser.username,
      location: mockUser.location,
      bio: mockUser.bio,
      stats: mockUser.stats,
      plan: mockUser.plan,
      joinedDate: mockUser.joinedDate
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  };
}

// Get mock user data for API responses
export function getMockUserData() {
  return getCurrentMockUser();
}
