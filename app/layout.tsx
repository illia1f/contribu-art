import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { Providers } from "./components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contribu-Art | Paint Your GitHub Graph",
  description:
    "Create art on your GitHub contribution graph by selecting cells and painting them with commits.",
  keywords: [
    "GitHub",
    "contribution graph",
    "art",
    "commits",
    "developer tools",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-surface text-text`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
