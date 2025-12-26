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
    <div className="flex min-h-screen flex-col">
      <Header
        username={session?.username}
        avatarUrl={session?.user?.image || undefined}
      />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Dashboard session={session} />
      </main>
    </div>
  );
}
