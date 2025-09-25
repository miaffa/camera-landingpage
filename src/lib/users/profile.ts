export interface UserProfile {
  id: string;
  supabaseUserId: string;
  name: string | null;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function createOrUpdateUserProfile(supabaseUser: any): Promise<UserProfile | null> {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
        avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create/update user profile');
    }

    const profile = await response.json();
    return profile;
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    return null;
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Profile not found
      }
      throw new Error('Failed to get user profile');
    }

    const profile = await response.json();
    return profile;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}
