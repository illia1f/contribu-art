"use client";

import { signOut } from "next-auth/react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { SignOutIcon } from "@/components/icons/SignOutIcon";
import { Logo } from "@/components/Logo";
import { GitHubRepoLink } from "@/components/GitHubRepoLink";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Avatar } from "@base-ui/react/avatar";
import { Menu } from "@base-ui/react/menu";

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
            <Menu.Root>
              <Menu.Trigger className="cursor-pointer rounded-full ring-offset-2 ring-offset-surface-raised transition-all hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar.Root className="w-9 h-9 rounded-full border-2 border-border flex items-center justify-center bg-surface-raised overflow-hidden transition-all hover:border-primary/50">
                  {avatarUrl && (
                    <Avatar.Image
                      src={avatarUrl}
                      alt={username}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <Avatar.Fallback>
                    <GitHubIcon className="w-5 h-5" />
                  </Avatar.Fallback>
                </Avatar.Root>
              </Menu.Trigger>

              <Menu.Portal>
                <Menu.Positioner align="end" sideOffset={8} className="z-50">
                  <Menu.Popup className="min-w-48 rounded-lg border border-border bg-surface-raised shadow-lg py-1 origin-(--transform-origin) transition-[transform,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                    {/* User info section */}
                    <div className="px-3 py-2 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Avatar.Root className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-surface overflow-hidden">
                          {avatarUrl && (
                            <Avatar.Image
                              src={avatarUrl}
                              alt={username}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <Avatar.Fallback>
                            <GitHubIcon className="w-4 h-4" />
                          </Avatar.Fallback>
                        </Avatar.Root>
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
                    <Menu.Item
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted cursor-pointer transition-colors hover:bg-surface hover:text-text focus-visible:bg-surface focus-visible:text-text focus-visible:outline-none"
                    >
                      <SignOutIcon className="w-4 h-4" />
                      Sign out
                    </Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          )}
        </div>
      </div>
    </header>
  );
}
