import { AuthGuard } from "@/components/auth/auth-guard";
import React from "react";

// Authentication is now enabled
const BYPASS_AUTH = false;


function AppLayout({ children }: { children: React.ReactNode }) {
  if (BYPASS_AUTH) {
    console.log("🚧 AUTH BYPASS ENABLED - Authentication is disabled for development");
    return (
      <div className="flex flex-col h-screen">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Development Mode:</strong> Authentication is bypassed. Set BYPASS_AUTH = false to enable auth.
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </AuthGuard>
  );
}

export default AppLayout;
