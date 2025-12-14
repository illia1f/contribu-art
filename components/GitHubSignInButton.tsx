"use client";

import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

export function GitHubSignInButton() {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/" })}
      className={cn(
        "w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg",
        "bg-[#24292f] hover:bg-[#32383f]",
        "border border-border",
        "transition-all duration-200",
        "font-medium text-white"
      )}
    >
      <GitHubIcon />
      Continue with GitHub
    </button>
  );
}
