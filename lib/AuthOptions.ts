// Importez votre instance Prisma
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { prisma } from "./db";

// Github
// const githubId = process.env.GITHUB_CLIENT_ID as string;
// const githubSecret = process.env.GITHUB_CLIENT_SECRET as string;

const urlString = process.env.NEXTAUTH_URL;

if (urlString && urlString.trim()) {
  const validUrl = new URL(urlString);
} else {
  console.error("Invalid NEXTAUTH_URL: ", urlString);
  throw new Error("Invalid NEXTAUTH_URL provided");
}

// Azure
const azureId = process.env.AZURE_AD_CLIENT_ID as string;
const azureSecret = process.env.AZURE_AD_CLIENT_SECRET as string;
const azureTenantId = process.env.AZURE_AD_TENANT_ID as string;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureADProvider({
      clientId: azureId,
      clientSecret: azureSecret,
      tenantId: azureTenantId,
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
    async redirect({ url, baseUrl }) {
      // Ici vous pouvez également vérifier les URLs avant de rediriger
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};
