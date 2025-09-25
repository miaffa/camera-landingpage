'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock user for development
    setUser({
      id: 'current-user',
      name: 'John Doe',
      email: 'john@example.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    });
    setIsLoading(false);
  }, []);

  const signIn = async (email: string) => {
    // Mock sign in
    console.log('Signing in with:', email);
    return { success: true };
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Mock sign up
    console.log('Signing up with:', email, name);
    return { success: true };
  };

  const signOut = async () => {
    setUser(null);
  };

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
};
