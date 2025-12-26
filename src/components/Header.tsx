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
    <header className="border-border bg-surface-raised sticky top-0 z-50 w-full border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
        <Logo size={54} withText={!isMobile} variant="simple" />

        <div className="flex items-center gap-3">
          <GitHubRepoLink />
          {username && (
            <DropdownMenu>
              <DropdownMenuTrigger className="ring-offset-surface-raised hover:ring-primary/50 focus-visible:ring-primary cursor-pointer rounded-full ring-offset-2 transition-all hover:ring-2 focus-visible:ring-2 focus-visible:outline-none">
                <Avatar className="border-border bg-surface-raised hover:border-primary/50 h-9 w-9 border-2 transition-all">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={username} />}
                  <AvatarFallback>
                    <GitHubIcon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="min-w-48"
              >
                {/* User info section */}
                <div className="border-border border-b px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="border-border bg-surface h-8 w-8 border">
                      {avatarUrl && (
                        <AvatarImage src={avatarUrl} alt={username} />
                      )}
                      <AvatarFallback>
                        <GitHubIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-text text-sm font-medium">
                        {username}
                      </span>
                      <span className="text-text-muted text-xs">
                        GitHub Account
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-text-muted hover:bg-surface hover:text-text focus-visible:bg-surface focus-visible:text-text flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none"
                >
                  <SignOutIcon className="h-4 w-4" />
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
