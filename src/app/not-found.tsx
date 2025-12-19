import Link from "next/link";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="bg-surface flex min-h-screen flex-col">
      <Header />
      <main className="animate-in fade-in zoom-in flex flex-1 flex-col items-center justify-center p-6 text-center duration-500">
        {/* Decorative 404 Grid */}
        <div className="mb-8 grid grid-cols-3 gap-1">
          {/* A simple pixel art representation or abstract pattern */}
          {[4, 4, 4, 4, 0, 4, 4, 4, 4, 0, 4, 0, 4, 0, 4].map((level, i) => (
            <div
              key={i}
              className={cn(
                "hover:bg-accent h-6 w-6 rounded-[2px] transition-colors duration-500",
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

        <h1 className="text-text mb-4 font-mono text-6xl font-bold">404</h1>
        <h2 className="text-text mb-2 text-2xl font-semibold">
          Page Not Found
        </h2>
        <p className="text-text-muted mb-8 max-w-md">
          The canvas you are looking for doesn&apos;t exist. It might have been
          painted over or never created.
        </p>

        <Link
          href="/"
          className={cn(
            "rounded-lg px-6 py-3",
            "bg-surface-raised border-border border",
            "hover:bg-surface-overlay hover:border-accent/50",
            "transition-all duration-200",
            "text-text font-medium",
            "flex items-center gap-2"
          )}
        >
          Return Home
        </Link>
      </main>
    </div>
  );
}
