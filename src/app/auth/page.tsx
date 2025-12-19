import { Header } from "@/components/Header";
import { GitHubSignInButton } from "@/components/GitHubSignInButton";
import { ImageIcon } from "@/components/icons/ImageIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { authMetadata } from "@/config/metadata";
import { Logo } from "@/components/Logo";
import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = authMetadata;

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-contrib-4/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-contrib-3/5 blur-[120px] rounded-full pointer-events-none" />

      <Header />

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="p-8 shadow-2xl bg-surface-raised/80 backdrop-blur-sm border-border rounded-2xl gap-8">
            <CardHeader className="text-center p-0">
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-2xl bg-surface border border-border shadow-inner">
                  <Logo size={80} />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-text tracking-tight mb-2">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-text-muted text-base">
                Sign in to paint your GitHub contribution graph
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-8">
              <GitHubSignInButton />

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="px-3 bg-card text-text-subtle font-medium">
                    Secure authentication
                  </span>
                </div>
              </div>

              {/* Info */}
              <p className="text-text-subtle text-[13px] text-center leading-relaxed">
                We need access to your repositories to create commits that paint
                your contribution graph. Your data stays secure with GitHub
                OAuth.
              </p>
            </CardContent>
          </Card>

          <div className="mt-12 grid grid-cols-3 gap-2">
            <FeatureItem label="Create Art">
              <ImageIcon className="size-5 text-contrib-4" />
            </FeatureItem>
            <FeatureItem label="Quick Paint">
              <ClockIcon className="size-5 text-contrib-4" />
            </FeatureItem>
            <FeatureItem label="Secure">
              <ShieldIcon className="size-5 text-contrib-4" />
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
    <div className="group flex flex-col items-center p-2 transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-surface-raised/50 border border-border flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md group-hover:border-contrib-3/50 group-hover:bg-contrib-3/10 transition-all duration-300">
        {children}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted group-hover:text-text transition-colors">
        {label}
      </p>
    </div>
  );
}
