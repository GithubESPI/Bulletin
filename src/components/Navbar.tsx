"use client";

import { ArrowRight } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  if (session) {
    console.log(session);
  }

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/home" className="flex z-40 font-semibold">
            <Image src="/logo.png" alt="logo" width={150} height={150} />
          </Link>

          <div className="h-full flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Déconnexion
                </button>
                {isAdmin ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                  >
                    Dashboard ✨
                  </Link>
                ) : null}
                <Link
                  href="/configure/utlisation"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Guide d&apos;utilisation
                </Link>
                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden bg-primary-50 sm:flex items-center gap-1",
                  })}
                >
                  Upload excel
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => signIn()}
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Se connecter
                </button>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden bg-primary-50 sm:flex items-center gap-1",
                  })}
                >
                  Upload un excel
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
