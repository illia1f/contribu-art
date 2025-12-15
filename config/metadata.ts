import type { Metadata } from "next";

const siteName = "Contribu-Art";
const siteDescription =
  "Create beautiful art on your GitHub contribution graph by selecting cells and painting them with commits.";
const baseKeywords = [
  "GitHub",
  "contribution graph",
  "art",
  "commits",
  "developer tools",
];

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://green-contribu-art.vercel.app";

/**
 * Base metadata shared across all pages
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} | Paint Your GitHub Graph`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: baseKeywords,
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    creator: "@contribu-art",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Generate page-specific metadata
 */
export function createMetadata(overrides: Partial<Metadata>): Metadata {
  return {
    ...baseMetadata,
    ...overrides,
    openGraph: {
      ...baseMetadata.openGraph,
      ...overrides.openGraph,
    },
    twitter: {
      ...baseMetadata.twitter,
      ...overrides.twitter,
    },
  };
}

/**
 * Home/Dashboard page metadata
 */
export const homeMetadata: Metadata = createMetadata({
  title: "Home",
  description:
    "Create beautiful art on your GitHub contribution graph. Select cells, choose colors, and paint your graph with commits.",
  keywords: [...baseKeywords, "dashboard", "paint", "graph editor"],
});

/**
 * Auth/Sign In page metadata
 */
export const authMetadata: Metadata = createMetadata({
  title: "Sign In",
  description:
    "Sign in with GitHub to start creating beautiful art on your GitHub contribution graph. Secure OAuth authentication with GitHub.",
  keywords: [
    ...baseKeywords,
    "sign in",
    "authentication",
    "OAuth",
    "GitHub login",
  ],
  openGraph: {
    title: "Sign In | Contribu-Art",
    description:
      "Sign in with GitHub to start creating beautiful art on your GitHub contribution graph.",
  },
  twitter: {
    title: "Sign In | Contribu-Art",
    description:
      "Sign in with GitHub to start creating beautiful art on your GitHub contribution graph.",
  },
});
