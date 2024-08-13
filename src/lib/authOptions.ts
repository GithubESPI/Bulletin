import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
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
    AzureADProvider({
      clientId: azureId,
      clientSecret: azureSecret,
      tenantId: azureTenantId,
      authorization: {
        params: {
          scope: "openid profile email offline_access",
        },
      },
    }),
    GithubProvider({
      clientId: githubId,
      clientSecret: githubSecret,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
