import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Dashboard } from "@/components/Dashboard";
import { homeMetadata } from "@/config/metadata";
import { ColorGuide } from "@/components/ColorGuide";
import { Header } from "@/components/Header";
import { Tips } from "@/components/Tips";

export const metadata = homeMetadata;

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        username={session?.username}
        avatarUrl={session?.user?.image || undefined}
      />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <Dashboard session={session} />
        <ColorGuide />
        <Tips />
      </main>
    </div>
  );
}
