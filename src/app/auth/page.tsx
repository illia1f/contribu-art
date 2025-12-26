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
    <div className="bg-surface relative flex min-h-screen flex-col overflow-hidden">
      {/* Background decoration */}
      <div className="bg-contrib-4/5 pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
      <div className="bg-contrib-3/5 pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />

      <Header />

      <main className="relative z-10 flex flex-1 items-center justify-center p-6">
        <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md duration-700">
          <Card className="bg-surface-raised/80 border-border gap-8 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <CardHeader className="p-0 text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-surface border-border rounded-2xl border p-3 shadow-inner">
                  <Logo size={80} />
                </div>
              </div>
              <CardTitle className="text-text mb-2 text-3xl font-bold tracking-tight">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-text-muted text-base">
                Sign in to paint your GitHub contribution graph
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 p-0">
              <GitHubSignInButton />

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs tracking-widest uppercase">
                  <span className="bg-card text-text-subtle px-3 font-medium">
                    Secure authentication
                  </span>
                </div>
              </div>

              {/* Info */}
              <p className="text-text-subtle text-center text-[13px] leading-relaxed">
                We need access to your repositories to create commits that paint
                your contribution graph. Your data stays secure with GitHub
                OAuth.
              </p>
            </CardContent>
          </Card>

          <div className="mt-12 grid grid-cols-3 gap-2">
            <FeatureItem label="Create Art">
              <ImageIcon className="text-contrib-4 size-5" />
            </FeatureItem>
            <FeatureItem label="Quick Paint">
              <ClockIcon className="text-contrib-4 size-5" />
            </FeatureItem>
            <FeatureItem label="Secure">
              <ShieldIcon className="text-contrib-4 size-5" />
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
      <div className="bg-surface-raised/50 border-border group-hover:border-contrib-3/50 group-hover:bg-contrib-3/10 mb-3 flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm transition-all duration-300 group-hover:shadow-md">
        {children}
      </div>
      <p className="text-text-muted group-hover:text-text text-[11px] font-semibold tracking-wider uppercase transition-colors">
        {label}
      </p>
    </div>
  );
}
