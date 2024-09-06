import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultUser & {
      id: string;
    };
    accessToken?: string; // Ajout de l'accessToken à la session
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string; // Ajout de l'accessToken au JWT
    userId?: string; // Ajout de l'userId au JWT
  }
}
