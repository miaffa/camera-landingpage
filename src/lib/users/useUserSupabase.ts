"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface UseUserSupabaseReturn {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export default function useUserSupabase(): UseUserSupabaseReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = supabaseBrowser();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("useUserSupabase - fetching user...");
      console.log("useUserSupabase - supabase client:", supabase);
      
      // First try to get the session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log("useUserSupabase - session:", session);
      console.log("useUserSupabase - session error:", sessionError);
      
      if (session?.user) {
        console.log("useUserSupabase - user from session:", session.user);
        setUser(session.user);
        setIsLoading(false);
        return;
      }
      
      // If no session, try getUser
      const { data: { user }, error } = await supabase.auth.getUser();
      
      console.log("useUserSupabase - getUser result:", { user, error });
      console.log("useUserSupabase - user details:", user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : null);
      
      if (error) {
        console.error("useUserSupabase - getUser error:", error);
        setError(error);
        setUser(null);
      } else {
        console.log("useUserSupabase - setting user:", user);
        setUser(user);
      }
    } catch (err) {
      console.error("useUserSupabase - error:", err);
      setError(err as Error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const mutate = () => {
    fetchUser();
  };

  useEffect(() => {
    console.log("useUserSupabase - useEffect running");
    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("useUserSupabase - auth state change:", { event, session });
        console.log("useUserSupabase - session user:", session?.user);
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          console.log("useUserSupabase - updating user state to:", session?.user);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUser, supabase.auth]);

  return { user, isLoading, error, mutate };
}
