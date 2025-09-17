"use client";

import Link from "next/link";
import { appConfig } from "@/lib/config";
// import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

const navItems: { label: string; href: string }[] = [
  // { label: "Pricing", href: "/#pricing" },
];


// const signInEnabled = process.env.NEXT_PUBLIC_SIGNIN_ENABLED === "true";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/30 dark:border-white/20 bg-white/20 dark:bg-white/10 backdrop-blur-md supports-backdrop-filter:bg-white/20 dark:supports-backdrop-filter:bg-white/10">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">{appConfig.projectName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Theme Switcher */}
          <div className="hidden items-center space-x-4 md:flex">
            <ThemeSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeSwitcher />
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-white/20 md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Mobile menu content can be added here if needed */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
