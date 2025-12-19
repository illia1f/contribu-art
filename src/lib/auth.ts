import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  basePath: "/api/auth",
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request repo scope for commit access
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and username to the token
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.username = profile.login as string;
        // Extract account creation year from GitHub profile
        const createdAt = (profile as { created_at?: string }).created_at;
        if (createdAt) {
          token.accountCreatedYear = new Date(createdAt).getFullYear();
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Make access token and username available in session
      session.accessToken = token.accessToken as string;
      session.username = token.username as string;
      session.accountCreatedYear =
        (token.accountCreatedYear as number | undefined) ??
        new Date().getFullYear();
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
});
