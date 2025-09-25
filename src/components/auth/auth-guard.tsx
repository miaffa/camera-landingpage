"use client";

import { useAuth } from "@/lib/users/useAuth";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, profile, isLoading, error } = useAuth();

  console.log("AuthGuard - user:", user);
  console.log("AuthGuard - profile:", profile);
  console.log("AuthGuard - isLoading:", isLoading);
  console.log("AuthGuard - error:", error);

  if (isLoading) {
    console.log("AuthGuard - showing loading skeleton");
    return (
      <div className="flex flex-col h-screen">
        <div className="border-b border-border/40 bg-background">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse" />
              <div className="hidden md:flex gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-16 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    console.log("AuthGuard - no user, redirecting to sign-in");
    console.log("AuthGuard - user state:", user);
    console.log("AuthGuard - isLoading state:", isLoading);
    console.log("AuthGuard - error state:", error);
    
    // Check localStorage for Supabase session
    const supabaseSession = localStorage.getItem('sb-bjdbcsgihtpgjrshnpeq-auth-token');
    console.log("AuthGuard - localStorage session:", supabaseSession);
    
    // Add delay to see logs before redirect
    setTimeout(() => {
      window.location.href = '/sign-in';
    }, 2000);
    
    return (
      <div className="flex flex-col h-screen">
        <div className="border-b border-border/40 bg-background">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse" />
              <div className="hidden md:flex gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-16 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log("AuthGuard - user authenticated, showing app content");
  return <>{children}</>;
}
