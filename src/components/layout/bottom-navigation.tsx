"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MapPin, MessageCircle, User } from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/app",
      icon: Home,
      label: "Home",
      isActive: pathname === "/app"
    },
    {
      href: "/search",
      icon: Search,
      label: "Search",
      isActive: pathname === "/search"
    },
    {
      href: "/map",
      icon: MapPin,
      label: "Map",
      isActive: pathname === "/map"
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
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 border-t border-blue-700">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 ${
                item.isActive
                  ? "text-white"
                  : "text-blue-200 hover:text-white transition-colors"
              }`}
            >
              <Icon className={`w-6 h-6 ${item.isActive ? "text-white" : "text-blue-200"}`} />
              <span className="text-xs mt-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
