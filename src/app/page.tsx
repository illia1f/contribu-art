import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Dashboard } from "@/components/Dashboard";
import { homeMetadata } from "@/config/metadata";
import { Header } from "@/components/Header";

export const metadata = homeMetadata;

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        username={session?.username}
        avatarUrl={session?.user?.image || undefined}
      />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Dashboard session={session} />
      </main>
    </div>
  );
}
