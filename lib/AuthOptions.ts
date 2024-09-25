// Importez votre instance Prisma
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { prisma } from "./db";

// Azure
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
      authorization: {
        params: { scope: "openid profile user.Read email" },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Vérifiez si account est défini
      if (!account) {
        return false;
      }

      // Logique pour lier les comptes OAuth, si un utilisateur est déjà enregistré
      const existingUser = await prisma.user.findFirst({
        where: { email: profile?.email },
      });

      if (existingUser) {
        // Associer le nouveau compte OAuth au compte existant
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: account.type,
            access_token: account.access_token, // Champs supportés par votre modèle Prisma
            token_type: account.token_type,
            scope: account.scope,
            expires_at: account.expires_at,
            id_token: account.id_token, // Si nécessaire
            refresh_token: account.refresh_token ?? null, // Si vous utilisez des tokens de rafraîchissement
            session_state: account.session_state ?? null,
          },
        });
        return true;
      }

      return true; // Toujours autoriser la connexion pour les nouveaux utilisateurs
    },
  },
};
