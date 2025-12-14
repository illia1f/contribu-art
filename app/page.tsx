import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Dashboard } from "@/components/Dashboard";
import { homeMetadata } from "@/config/metadata";

export const metadata = homeMetadata;

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  return <Dashboard session={session} />;
}
