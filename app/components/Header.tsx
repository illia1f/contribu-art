"use client";

import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  username?: string;
  avatarUrl?: string;
}

export function Header({ username, avatarUrl }: HeaderProps) {
  return (
    <header className="w-full border-b border-border bg-surface-raised">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-contrib-2 to-contrib-4 flex items-center justify-center">
            <span className="text-lg">🎨</span>
          </div>
          <h1 className="text-xl font-bold text-text tracking-tight">
            Contribu-Art
          </h1>
        </div>

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
                "text-text hover:text-white",             // New: text color and hover white
                "hover:bg-red-600 hover:border-red-700",  // New: red hover for sign out action
                "transition-all duration-200",
                "font-medium flex items-center gap-2"    // New: for icon spacing
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

