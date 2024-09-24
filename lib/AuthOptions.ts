// Importez votre instance Prisma
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "./db";

// Github
const githubId = process.env.GITHUB_CLIENT_ID as string;
const githubSecret = process.env.GITHUB_CLIENT_SECRET as string;

// Azure
// const azureId = process.env.AZURE_AD_CLIENT_ID as string;
// const azureSecret = process.env.AZURE_AD_CLIENT_SECRET as string;
// const azureTenantId = process.env.AZURE_AD_TENANT_ID as string;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: githubId,
      clientSecret: githubSecret,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      console.log(session, user);
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
