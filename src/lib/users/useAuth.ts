"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { createOrUpdateUserProfile, getUserProfile, UserProfile } from "./profile";

interface UseAuthReturn {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = supabaseBrowser();

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Error signing out:", err);
      setError(err as Error);
    }
  };

  const fetchUserAndProfile = async (supabaseUser: User) => {
    try {
      console.log("useAuth - fetching user profile for:", supabaseUser.email);
      
      // First try to get existing profile
      let userProfile = await getUserProfile();
      
      // If no profile exists, create one
      if (!userProfile) {
        console.log("useAuth - no existing profile, creating new one");
        userProfile = await createOrUpdateUserProfile(supabaseUser);
      }
      
      if (userProfile) {
        console.log("useAuth - user profile loaded:", userProfile);
        setProfile(userProfile);
      } else {
        console.error("useAuth - failed to load/create user profile");
        setError(new Error("Failed to load user profile"));
      }
    } catch (err) {
      console.error("useAuth - error fetching user profile:", err);
      setError(err as Error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("useAuth - initializing authentication...");
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("useAuth - session error:", sessionError);
          setError(sessionError);
          return;
        }

        if (session?.user) {
          console.log("useAuth - user found in session:", session.user);
          setUser(session.user);
          await fetchUserAndProfile(session.user);
        } else {
          console.log("useAuth - no user in session");
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("useAuth - initialization error:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("useAuth - auth state change:", { event, session });
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("useAuth - user signed in:", session.user);
          setUser(session.user);
          await fetchUserAndProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log("useAuth - user signed out");
          setUser(null);
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log("useAuth - token refreshed:", session.user);
          setUser(session.user);
          // Optionally refresh profile data
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return { user, profile, isLoading, error, signOut };
}
