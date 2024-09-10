"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ButtonsProvider = dynamic(() => import("../components/ButtonsProvider"), {
  ssr: false, // Disable Server Side Rendering if necessary
});

export default function Page() {
  const { data: session, status } = useSession();
  console.log(session);

  const router = useRouter();

  useEffect(() => {
    console.log("Status:", status); // Ajoutez ceci pour voir le statut dans la console
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  return (
    <main className="relative h-screen w-full">
      <div className="absolute size-full">
        <Image
          src="/images/background.png"
          alt="background"
          fill
          className="size-full"
          loading="lazy"
        />
      </div>

      <div className="flex-center glassmorphism-auth h-screen w-full">
        <div className="flex items-center justify-center min-h-screen p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <Image
                src="/images/logo.png"
                alt="logo"
                width={180}
                height={180}
                className="m-auto"
              />
            </CardHeader>

            <CardContent>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">
                Connectez-vous
              </CardTitle>
              <CardDescription className="text-center pb-8 pt-3">
                Pour continuer sur l&apos;application des bulletin
              </CardDescription>
              <ButtonsProvider />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
