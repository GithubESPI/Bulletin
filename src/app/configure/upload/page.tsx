"use client";

import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
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
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("fileUploader", {
    onClientUploadComplete: (data) => {
      const configId = data[0]?.serverData?.configId;
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

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

  const onDropAccepted = async (acceptedFiles: File[]) => {
    const formData = new FormData();
    let hasExcel = false;
    let hasWord = false;

    acceptedFiles.forEach((file) => {
      if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
        formData.append("excel_file", file, file.name);
        hasExcel = true;
      } else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
        formData.append("word_file", file, file.name);
        hasWord = true;
      }
    });

    if (!hasExcel || !hasWord) {
      setMissingFile(!hasExcel ? "Excel manquant" : "Word manquant");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/upload-and-integrate-excel-and-word", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Gérez le succès ici
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to upload and integrate files");
      }
    } catch (error) {
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Erreur lors de l'upload",
        description: errorMessage,
        variant: "destructive",
        className: "bg-destructive-50 border-transparent",
      });
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
                <p className="text-xs text-zinc-500">Excel (.xls, .xlsx), Word (.doc)</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default Page;
