"use client";

import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { FileUp, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";
import { v4 as uuidv4 } from "uuid"; // Import UUID

const Page = () => {
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [missingFile, setMissingFile] = useState<string | null>(null);
  const [sessionId] = useState(uuidv4()); // Create a sessionId
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;

    setIsDragOver(false);

    toast({
      title: `${file.file.type} n'est pas pris en charge.`,
      description: "Veuillez choisir un document Excel ou Word.",
      variant: "destructive",
      className: "bg-destructive-50 border-transparent",
    });
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    const newFiles = [...uploadedFiles, ...acceptedFiles];
    setUploadedFiles(newFiles);

    const hasExcel = newFiles.some(
      (file) => file.name.endsWith(".xls") || file.name.endsWith(".xlsx")
    );
    const hasWord = newFiles.some(
      (file) => file.name.endsWith(".doc") || file.name.endsWith(".docx")
    );

    if (hasExcel && hasWord) {
      setIsUploading(true);
      const formData = new FormData();
      newFiles.forEach((file) => {
        if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
          formData.append("excel_file", file, file.name);
        } else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
          formData.append("word_file", file, file.name);
        }
      });

      fetch("http://localhost:8000/upload-and-integrate-excel-and-word", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.detail || "Failed to upload and integrate files");
            });
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          if (result.configId) {
            startTransition(() => {
              router.push(`/configure/design?id=${result.configId}`);
            });
          } else {
            throw new Error("No configId returned from the server");
          }
          setIsUploading(false);
        })
        .catch((error) => {
          toast({
            title: "Erreur lors de l'upload",
            description: error.message,
            variant: "destructive",
            className: "bg-destructive-50 border-transparent",
          });
          setIsUploading(false);
        });

      setMissingFile(null);
    } else if (!hasExcel) {
      setMissingFile("Extraction des notes manquante.");
    } else if (!hasWord) {
      setMissingFile("Document word avec les appréciations manquant.");
    }

    setIsDragOver(false);
  };

  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
        {
          "ring-blue-900/25 bg-blue-900/10": isDragOver,
        }
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          maxFiles={2}
          accept={{
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "application/msword": [".doc"],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
              ) : (
                <FileUp className="h-6 w-6 text-zinc-500 mb-2" />
              )}
              <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Téléchargement...</p>
                    <Progress value={uploadProgress} className="mt-2 w-40 h-2 bg-gray-300" />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirection, veuillez patienter...</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Déposer un fichier</span> à télécharger
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Cliquer pour télécharger</span> ou
                    glisser-déposer un excel et un word
                  </p>
                )}
                {missingFile && <p className="text-red-500 text-center">{missingFile}</p>}
              </div>

              {isPending ? null : (
                <p className="text-xs text-zinc-500">Excel (.xls, .xlsx), Word (.doc, .docx)</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default Page;
