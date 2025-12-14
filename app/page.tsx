import { auth } from "@/lib/auth";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <LandingPage />;
  }

  return <Dashboard session={session} />;
}