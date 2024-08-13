"use client";

import Bulletin from "@/components/Bulletin";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";

const DesignPreview = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const user = session?.user?.id;

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleGenerate = async () => {
    setIsLoading(true);
    setIsModalOpen(true);
    setIsSuccess(null); // Reset success state
    setModalMessage("Génération des documents en cours...");

    try {
      // Récupération des documents
      const response = await fetch(`/api/documents?userId=${user}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Excel URL:", data.excelUrl);
      console.log("Word URL:", data.wordUrl);

      // Envoi des URLs au backend Python
      const generateResponse = await fetch(
        "http://localhost:8000/upload-and-integrate-excel-and-word",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: user,
            excelUrl: data.excelUrl,
            wordUrl: data.wordUrl,
          }),
        }
      );

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        throw new Error(errorText || "Unknown error during document generation");
      }

      const generateData = await generateResponse.json();
      console.log("Generated documents:", generateData);

      setIsSuccess(true);
      setModalMessage("Les bulletins PDF ont été générés avec succès.");

      // Téléchargement du fichier ZIP généré via la nouvelle route
      const link = document.createElement("a");
      link.href = `http://localhost:8000/download-zip/${encodeURIComponent(
        generateData.zip_path.split("\\").pop()
      )}`;
      link.setAttribute("download", "bulletins.zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("Error generating documents:", error);
      setIsSuccess(false);
      setModalMessage("Erreur lors de la génération des documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setShowConfetti(true);
  }, []); // Pass an empty array as the second argument

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti active={showConfetti} config={{ elementCount: 400, spread: 150 }} />
      </div>

      <div className="mt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2">
          <Bulletin className={cn("max-w-[150px] md:max-w-full")} imgSrc="" />
        </div>

        <div className="mt-6 sm:col-span-9 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Félicitations, {session?.user?.name}
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            Sont prêts pour être générés
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Bulletins Téléchagés</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Téléchargement des bulletins en .zip</li>
                <li>Bulletins en format PDF</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Bulletins envoyés sur Yparéo</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Envoie des bulletins dans les répertoires de chaques apprenants.</li>
                <li>Bulletins en format PDF</li>
              </ol>
            </div>
          </div>

          <div className="mt-8 flex justify-end pb-12">
            <Button
              className="px-4 sm:px-6 lg:px-8 bg-primary-50"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  Générer vos bulletins
                  <ArrowRight className="h-4 w-4 ml-1.5 inline" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title={isLoading ? "Génération en cours" : isSuccess ? "Succès" : "Erreur"}
        description={modalMessage}
      >
        {isLoading && <Progress value={progress} className="w-full" />}
      </LoginModal>
    </>
  );
};

export default DesignPreview;
