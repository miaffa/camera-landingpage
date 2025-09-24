"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUser from "@/lib/users/useUser";
import Link from "next/link";
import { LayoutDashboard, CreditCard, LogOut, UserIcon, Ticket, LogIn, UserPlus } from "lucide-react";

export function UserButton() {
  const { user, isLoading } = useUser();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse" />
      </div>
    );
  }

  // Show login/signup buttons for unauthenticated users
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/sign-in" className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Up</span>
          </Link>
        </Button>
      </div>
    );
  }

  // Show user menu for authenticated users
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-hidden">
        <Avatar>
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback>
            {user?.name ? (
              getInitials(user.name)
            ) : (
              <UserIcon className="w-4 h-4" />
            )}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium md:inline-block">
          {user?.name || user?.email}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name || "-"}</p>
            {user?.email && (
              <p className="text-xs text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/app/plan" className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Plan
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/app/redeem-ltd" className="cursor-pointer">
            <Ticket className="mr-2 h-4 w-4" />
            Redeem LTD Coupon
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/sign-out" className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
