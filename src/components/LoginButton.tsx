"use client";

import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "./icons/GitHubIcon";

export function LoginButton() {
  return (
    <button
      onClick={() => signIn("github")}
      className={cn(
        "flex items-center gap-3 rounded-lg px-6 py-3",
        "bg-surface-raised border-border border",
        "hover:bg-surface-overlay hover:border-accent/50",
        "transition-all duration-200",
        "text-text font-medium"
      )}
    >
      <GitHubIcon />
      Sign in with GitHub
    </button>
  );
}
