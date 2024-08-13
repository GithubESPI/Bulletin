import { db } from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  excelUploader: f({
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "4GB" },
    "application/vnd.ms-excel": { maxFileSize: "4GB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "4GB",
    },
    "application/msword": { maxFileSize: "4GB" },
  })
    .input(z.object({ userId: z.string() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata.input;

      const isExcelFile =
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      const isWordFile =
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword";

      let existingConfig = await db.configuration.findFirst({
        where: { userId: userId },
      });

      if (existingConfig) {
        // Update existing configuration
        const updatedData: any = { updatedAt: new Date() };

        if (isExcelFile) {
          updatedData.excelUrl = file.url;
        }
        if (isWordFile) {
          updatedData.wordUrl = file.url;
        }

        const updatedConfiguration = await db.configuration.update({
          where: {
            id: existingConfig.id,
          },
          data: updatedData,
        });

        return { configId: updatedConfiguration.id };
      } else {
        // Create a new configuration
        const initialData: any = {
          fileName: isExcelFile ? "excel-et-word" : "excel-et-word",
          userId: userId,
          excelUrl: isExcelFile ? file.url : "excel manquant",
          wordUrl: isWordFile ? file.url : "word manquant",
          croppedExcelUrl: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const configuration = await db.configuration.create({
          data: initialData,
        });

        return { configId: configuration.id };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
