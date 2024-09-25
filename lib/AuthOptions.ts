// Importez votre instance Prisma
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { prisma } from "./db";

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
  },
};
