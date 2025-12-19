"use client";

import { signOut } from "next-auth/react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { SignOutIcon } from "@/components/icons/SignOutIcon";
import { Logo } from "@/components/Logo";
import { GitHubRepoLink } from "@/components/GitHubRepoLink";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  username?: string;
  avatarUrl?: string;
}

export function Header({ username, avatarUrl }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-raised">
      <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
        <Logo size={54} withText={!isMobile} variant="simple" />

        <div className="flex items-center gap-3">
          <GitHubRepoLink />
          {username && (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer rounded-full ring-offset-2 ring-offset-surface-raised transition-all hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar className="w-9 h-9 border-2 border-border bg-surface-raised transition-all hover:border-primary/50">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={username} />}
                  <AvatarFallback>
                    <GitHubIcon className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="min-w-48"
              >
                {/* User info section */}
                <div className="px-3 py-2 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-border bg-surface">
                      {avatarUrl && (
                        <AvatarImage src={avatarUrl} alt={username} />
                      )}
                      <AvatarFallback>
                        <GitHubIcon className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text">
                        {username}
                      </span>
                      <span className="text-xs text-text-muted">
                        GitHub Account
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted cursor-pointer transition-colors hover:bg-surface hover:text-text focus-visible:bg-surface focus-visible:text-text focus-visible:outline-none"
                >
                  <SignOutIcon className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
