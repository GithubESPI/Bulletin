import { db } from "@/lib/db"; // Importez votre instance Prisma
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Github
const githubId = process.env.GITHUB_CLIENT_ID as string;
const githubSecret = process.env.GITHUB_CLIENT_SECRET as string;

// Azure
const azureId = process.env.AZURE_AD_CLIENT_ID as string;
const azureSecret = process.env.AZURE_AD_CLIENT_SECRET as string;
const azureTenantId = process.env.AZURE_AD_TENANT_ID as string;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Si c'est la première fois que l'utilisateur se connecte
      if (account && user) {
        token.accessToken = account.access_token;
        token.userId = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      // Assurez-vous que le token est bien défini dans la session
      if (token && token.userId) {
        session.user.id = token.userId;
      }
      if (token && token.accessToken) {
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Utiliser JWT pour les sessions
  },
  debug: process.env.NODE_ENV === "development",
};
