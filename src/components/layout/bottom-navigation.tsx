"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageCircle, User, Camera } from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/app",
      icon: Home,
      label: "Feed",
      isActive: pathname === "/app"
    },
    {
      href: "/marketplace",
      icon: Search,
      label: "Search",
      isActive: pathname === "/marketplace"
    },
    {
      href: "/create",
      icon: Plus,
      label: "Create",
      isActive: pathname === "/create"
    },
    {
      href: "/messages",
      icon: MessageCircle,
      label: "Messages",
      isActive: pathname === "/messages"
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      isActive: pathname === "/profile"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 rounded-lg transition-colors ${
                item.isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs mt-1 truncate font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
