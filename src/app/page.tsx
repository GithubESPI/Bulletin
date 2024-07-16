"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/logo.png"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          {/* <Button className="p-5" onClick={() => signIn("")}>
            Se connecter avec Azure
          </Button> */}
          <Button className="p-5" onClick={() => signIn("github")}>
            Se connecter avec Github
          </Button>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              &copy; ESPI {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </section>

      <Image
        src="/onboarding.png"
        height={1000}
        width={1000}
        alt="image-onboarding"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
