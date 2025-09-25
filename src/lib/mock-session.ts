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
    }
  };
}

// Get mock user data for API responses
export function getMockUserData() {
  return getCurrentMockUser();
}
