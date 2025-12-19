"use client";

import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";

export function GitHubSignInButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      // Small delay to ensure the animation is visible before the redirect starts
      await signIn("github", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className={cn(
        "cursor-pointer w-full flex items-center justify-center gap-3 h-12 rounded-xl",
        "bg-[#24292f] hover:bg-[#1b1f23] text-white border-none",
        "transition-all duration-300 font-semibold text-base shadow-md hover:shadow-lg",
        "disabled:opacity-80 disabled:cursor-not-allowed",
        className
      )}
    >
      {isLoading ? (
        <IconLoader2 className="size-5 animate-spin text-white/80" />
      ) : (
        <GitHubIcon className="size-5" />
      )}
      <span className="transition-all duration-300">
        {isLoading ? "Connecting..." : "Continue with GitHub"}
      </span>
    </Button>
  );
}
