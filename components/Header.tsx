"use client";

import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { SignOutIcon } from "@/components/icons/SignOutIcon";
import { Logo } from "@/components/Logo";

interface HeaderProps {
  username?: string;
  avatarUrl?: string;
}

export function Header({ username, avatarUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-raised">
      <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
        <Logo size={54} withText />

        {username && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-8 h-8 rounded-full border border-border"
                />
              )}
              <span className="text-text-muted text-sm font-medium">
                {username}
              </span>
            </div>
            <button
              onClick={() => signOut()}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm",
                "bg-surface-raised border border-border", // New: prominent background and border
                "text-text hover:text-white", // New: text color and hover white
                "hover:bg-red-600 hover:border-red-700", // New: red hover for sign out action
                "transition-all duration-200",
                "font-medium flex items-center gap-2" // New: for icon spacing
              )}
            >
              <SignOutIcon />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
