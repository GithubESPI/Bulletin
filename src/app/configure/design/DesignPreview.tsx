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
import { useEffect, useRef, useState } from "react";
import Confetti from "react-dom-confetti";

const checkUrlAccess = async (url: string): Promise<void> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      throw new Error(`Access denied to URL: ${url}`);
    }
  } catch (error) {
    console.error(`Failed to access URL: ${url}`, error);
    throw error;
  }
};

const DesignPreview = () => {
  const { data: session } = useSession();
  const sessionId = session?.user?.id ?? "";
  const router = useRouter();
  const { toast } = useToast();

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [zipPath, setZipPath] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isImportingFromDirectory, setIsImportingFromDirectory] = useState<boolean>(false);

  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const initializeWebSocket = (sessionId: string) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/progress/${sessionId}`);
    websocketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
      setProgress(data.progress); // Update the progress state with received data
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      websocketRef.current = null;
    };
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setIsModalOpen(true);
    setIsSuccess(null);
    setModalMessage("Génération des documents en cours...");

    try {
      const response = await fetch(`/api/documents?userId=${sessionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Excel URL:", data.excelUrl);
      console.log("Word URL:", data.wordUrl);

      await checkUrlAccess(data.excelUrl);
      await checkUrlAccess(data.wordUrl);

      // Initialize WebSocket connection to receive progress updates
      initializeWebSocket(sessionId);

      const generateResponse = await fetch(
        "http://localhost:8000/upload-and-integrate-excel-and-word",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: sessionId,
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
      console.log("Generated documents response:", generateData);

      // Nouveau code de gestion des erreurs et succès
      if (generateData.message.includes("Failed to fetch API data")) {
        setModalMessage(
          "Impossible de récupérer les données de Yparéo. Veuillez réessayer plus tard."
        );
      } else if (generateData.message.includes("zipped successfully")) {
        setIsSuccess(true);
        setModalMessage("Les bulletins PDF ont été générés et compressés avec succès.");
        setZipPath(generateData.zip_path);

        const link = document.createElement("a");
        link.href = `http://localhost:8000/download-zip/${encodeURIComponent(
          generateData.zip_path.split("\\").pop() || ""
        )}`;
        link.setAttribute("download", "bulletins.zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setIsSuccess(false);
        setModalMessage(
          "Erreur lors de la génération des bulletins. Veuillez vérifier les détails."
        );
      }
    } catch (error) {
      console.error("Error generating documents:", error);
      setIsSuccess(false);
      setModalMessage("Erreur lors de la génération des documents.");
    } finally {
      setIsLoading(false);
      if (websocketRef.current) {
        websocketRef.current.close(); // Close WebSocket connection
      }
    }
  };

  const handleImportFromDirectory = async () => {
    setIsImportingFromDirectory(true);
    setModalMessage("Importation des bulletins depuis le répertoire en cours...");

    try {
      const response = await fetch("http://localhost:8000/import-bulletins-from-directory", {
        method: "POST",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unknown error during import from directory");
      }

      const data = await response.json();
      setModalMessage(`Importation terminée : ${data.message}`);
    } catch (error) {
      console.error("Error importing documents from directory:", error);
      setModalMessage("Erreur lors de l'importation des bulletins depuis le répertoire.");
    } finally {
      setIsImportingFromDirectory(false);
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
            Vos documents sont prêts pour être générés et téléchargés.
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Bulletins Générés</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Les bulletins ont été générés en format PDF.</li>
                <li>Les fichiers sont prêts pour être téléchargés sous forme de fichier ZIP.</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Statut de l&apos;opération</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>
                  {isSuccess === true
                    ? "Succès : Tous les bulletins ont été générés et compressés avec succès."
                    : isSuccess === false
                    ? "Erreur : Problème lors de la génération des bulletins."
                    : "En attente de génération."}
                </li>
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
            &nbsp;
            <Button
              className="px-4 sm:px-6 lg:px-8 bg-primary-50"
              onClick={handleImportFromDirectory}
              disabled={isImportingFromDirectory}
            >
              {isImportingFromDirectory ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  Importer depuis le répertoire
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
