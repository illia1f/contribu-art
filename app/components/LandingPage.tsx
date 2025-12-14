import { Header } from "./Header";
import { LoginButton } from "./LoginButton";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-contrib-2 to-contrib-4 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">🎨</span>
          </div>
          <h1 className="text-3xl font-bold text-text mb-4">
            Paint Your GitHub Graph
          </h1>
          <p className="text-text-muted mb-8 leading-relaxed">
            Create beautiful art on your GitHub contribution graph. Select the
            cells you want to paint, choose your colors, and watch as commits
            bring your graph to life.
          </p>
          <LoginButton />
          <p className="text-text-subtle text-xs mt-6">
            Requires access to your repositories to create commits
          </p>
        </div>
      </main>
    </div>
  );
}
