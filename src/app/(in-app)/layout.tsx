"use client";

// import { Footer } from "@/components/layout/footer"; // TODO: Use for desktop layout
// import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import React from "react";
import useUser from "@/lib/users/useUser";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header Shimmer */}
      <div className="border-b border-border/40 bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {/* Logo/Brand shimmer */}
            <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse" />
            {/* Navigation items shimmer */}
            <div className="hidden md:flex gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 w-20 bg-gray-200 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
          {/* User menu shimmer */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Shimmer */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar Shimmer */}
        <div className="hidden md:block w-64 border-r border-border/40 bg-background p-4">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Main Content Shimmer */}
        <div className="flex-1 p-4">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* Page title shimmer */}
            <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse" />

            {/* Content blocks shimmer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg border border-border/40 bg-card"
                >
                  <div className="flex flex-col gap-4">
                    <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Shimmer */}
      <div className="md:hidden border-t border-border/40 bg-background">
        <div className="grid grid-cols-5 h-16">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-1 p-2"
            >
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex flex-col h-screen">
      {/* <AppHeader /> */}
      <div className="flex-1 flex">
        <div className={`flex-1 p-2 sm:p-4 max-w-7xl mx-auto w-full overflow-y-auto transition-all duration-300 ${
          isCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
          {children}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { isLoading, error } = useUser();
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  // Show loading skeleton while checking authentication or loading user data
  if (status === "loading" || isLoading) {
    return <DashboardSkeleton />;
  }

  // If there's an error loading user data, redirect to sign-in
  if (error || status === "unauthenticated") {
    return <DashboardSkeleton />; // This will redirect via useEffect
  }

  // If authenticated and user data loaded successfully
  if (session && !isLoading) {
    return (
      <SidebarProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </SidebarProvider>
    );
  }

  // Fallback loading state
  return <DashboardSkeleton />;
}

export default AppLayout;
