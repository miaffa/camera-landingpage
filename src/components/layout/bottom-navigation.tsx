"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { appConfig } from "@/lib/config";
import { 
  Home, 
  Search, 
  Plus, 
  MessageCircle, 
  User 
} from "lucide-react";

const navigationItems = [
  {
    name: "Home",
    href: "/app",
    icon: Home,
    label: "Home & Feed"
  },
  {
    name: "Marketplace",
    href: "/app/marketplace",
    icon: Search,
    label: "Marketplace"
  },
  {
    name: "Create",
    href: "/app/create",
    icon: Plus,
    label: "List Gear"
  },
  {
    name: "Messages",
    href: "/app/messages",
    icon: MessageCircle,
    label: "Messages"
  },
  {
    name: "Profile",
    href: "/app/profile",
    icon: User,
    label: "Profile"
  }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40 md:hidden">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/app" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-2 py-2 transition-colors",
                  "hover:bg-accent/50 active:bg-accent/70",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon 
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110"
                  )} 
                />
                <span className="text-xs font-medium leading-none">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:block fixed left-0 top-0 bottom-0 w-64 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border/40">
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-4 border-b border-border/40">
            <Link href="/app" className="flex items-center gap-3">
              <Image
                src="/assets/logo.png"
                alt="LensFlare"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-foreground">
                {appConfig.projectName}
              </span>
            </Link>
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/app" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-accent/50",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          </div>
        </div>
      </nav>
    </>
  );
}
