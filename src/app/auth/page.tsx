import { Header } from "@/components/Header";
import { GitHubSignInButton } from "@/components/GitHubSignInButton";
import { ImageIcon } from "@/components/icons/ImageIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { authMetadata } from "@/config/metadata";
import { Logo } from "@/components/Logo";
import { ReactNode } from "react";

export const metadata = authMetadata;

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-surface-raised border border-border rounded-xl p-8 shadow-lg">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size={124} />
              </div>
              <h2 className="text-2xl font-bold text-text mb-2">
                Welcome Back
              </h2>
              <p className="text-text-muted text-sm">
                Sign in to paint your GitHub contribution graph
              </p>
            </div>

            <GitHubSignInButton />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-surface-raised text-text-muted">
                  Secure authentication
                </span>
              </div>
            </div>

            {/* Info */}
            <p className="text-text-subtle text-xs text-center leading-relaxed">
              We need access to your repositories to create commits that paint
              your contribution graph. Your data stays secure with GitHub OAuth.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <FeatureItem label="Create Art">
              <ImageIcon className="size-5 text-contrib-3" />
            </FeatureItem>
            <FeatureItem label="Quick Paint">
              <ClockIcon className="size-5 text-contrib-3" />
            </FeatureItem>
            <FeatureItem label="Secure">
              <ShieldIcon className="size-5 text-contrib-3" />
            </FeatureItem>
          </div>
        </div>
      </main>
    </div>
  );
}

interface FeatureItemProps {
  label: string;
  children: ReactNode;
}

function FeatureItem({ children, label }: FeatureItemProps) {
  return (
    <div className="p-3">
      <div className="w-10 h-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center mx-auto mb-2">
        {children}
      </div>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}
