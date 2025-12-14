import Link from "next/link";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        {/* Decorative 404 Grid */}
        <div className="grid grid-cols-3 gap-1 mb-8">
          {/* A simple pixel art representation or abstract pattern */}
          {[4, 4, 4, 4, 0, 4, 4, 4, 4, 0, 4, 0, 4, 0, 4].map((level, i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-6 rounded-[2px] transition-colors duration-500 hover:bg-accent",
                level === 0
                  ? "bg-contrib-0"
                  : level === 1
                  ? "bg-contrib-1"
                  : level === 2
                  ? "bg-contrib-2"
                  : level === 3
                  ? "bg-contrib-3"
                  : "bg-contrib-4"
              )}
            />
          ))}
        </div>

        <h1 className="text-6xl font-mono font-bold text-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text mb-2">
          Page Not Found
        </h2>
        <p className="text-text-muted max-w-md mb-8">
          The canvas you are looking for doesn&apos;t exist. It might have been
          painted over or never created.
        </p>

        <Link
          href="/"
          className={cn(
            "px-6 py-3 rounded-lg",
            "bg-surface-raised border border-border",
            "hover:bg-surface-overlay hover:border-accent/50",
            "transition-all duration-200",
            "font-medium text-text",
            "flex items-center gap-2"
          )}
        >
          Return Home
        </Link>
      </main>
    </div>
  );
}
