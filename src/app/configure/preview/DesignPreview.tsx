"use client";

import Bulletin from "@/components/Bulletin";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MODELS } from "@/validators/option-validator";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Configuration } from "@prisma/client";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
  const router = useRouter();
  const { id } = configuration;
  const { user } = useKindeBrowserClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  useEffect(() => setShowConfetti(true));

  const { model } = configuration;

  const { label: modelLabel } = MODELS.options.find(({ value }) => value === model)!;

  const handleCheckout = () => {
    if (user) {
    } else {
      // need to log in
      localStorage.setItem("configurationId", id);
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti active={showConfetti} config={{ elementCount: 400, spread: 150 }} />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2">
          <Bulletin
            className={cn("max-w-[150px] md:max-w-full")}
            imgSrc={configuration.excelUrl!}
          />
        </div>

        <div className="mt-6 sm:col-span-9 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">Vos {modelLabel}</h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            Sont prêts pour être générés
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Points forts</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High-quality, durable material</li>
                <li>Scratch- and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>

          <div className="mt-8 flex justify-end pb-12">
            <Button onClick={() => handleCheckout()} className="px-4 sm:px-6 lg:px-8 bg-primary-50">
              Générer vos bulletins
              <ArrowRight className="h-4 w-4 ml-1.5 inline" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview;
