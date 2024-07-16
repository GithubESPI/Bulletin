import { db } from "@/db";
import fetch from "node-fetch";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

// Ensure environment variables are defined
const YPAERO_BASE_URL = process.env.YPAERO_BASE_URL as string;
const YPAERO_API_TOKEN = process.env.YPAERO_API_TOKEN as string;

interface UploadedFile {
  url: string;
  name: string;
  type: string;
}

const f = createUploadthing();

const uploadSessions: Record<string, { excelUrl?: string; wordUrl?: string }> = {};

export const ourFileRouter = {
  fileUploader: f({
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "4GB" },
    "application/vnd.ms-excel": { maxFileSize: "4GB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "4GB",
    },
    "application/msword": { maxFileSize: "4GB" },
  })
    .input(z.object({ configId: z.string().optional(), sessionId: z.string() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId, sessionId } = metadata.input;
      const uploadedFile = file as UploadedFile;

      try {
        console.log("Received file:", uploadedFile);

        if (!uploadedFile) {
          console.error("No file uploaded.");
          throw new Error("No file uploaded");
        }

        // Initialize session if not present
        if (!uploadSessions[sessionId]) {
          uploadSessions[sessionId] = {};
        }

        // Store the uploaded file URL in the session
        if (uploadedFile.name.endsWith(".xls") || uploadedFile.name.endsWith(".xlsx")) {
          uploadSessions[sessionId].excelUrl = uploadedFile.url;
        } else if (uploadedFile.name.endsWith(".doc") || uploadedFile.name.endsWith(".docx")) {
          uploadSessions[sessionId].wordUrl = uploadedFile.url;
        }

        // Check if both files are uploaded
        const { excelUrl, wordUrl } = uploadSessions[sessionId];
        if (excelUrl && wordUrl) {
          const fileName = uploadedFile.name;

          // Fetch Ypareo data
          const fetchApiData = async (url: string, headers: HeadersInit) => {
            const response = await fetch(url, { headers });
            if (!response.ok) {
              throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
            }
            return response.json();
          };

          const headers = {
            "X-Auth-Token": YPAERO_API_TOKEN,
            "Content-Type": "application/json",
          };

          const [apprenantsData, groupesData, absencesData] = await Promise.all([
            fetchApiData(
              `${YPAERO_BASE_URL}/r/v1/formation-longue/apprenants?codesPeriode=2`,
              headers
            ),
            fetchApiData(`${YPAERO_BASE_URL}/r/v1/formation-longue/groupes`, headers),
            fetchApiData(`${YPAERO_BASE_URL}/r/v1/absences/01-01-2023/31-12-2024`, headers),
          ]);

          // Further processing with the fetched data and the uploaded files
          // Add your code for processing the data and integrating it with the template here

          // Save the processed data back to Prisma
          if (!configId) {
            const configuration = await db.configuration.create({
              data: {
                excelUrl,
                wordUrl,
                fileName,
              },
            });
            console.log("New configuration created with ID:", configuration.id);
            delete uploadSessions[sessionId];
            return { configId: configuration.id };
          } else {
            const updatedConfiguration = await db.configuration.update({
              where: { id: configId },
              data: {
                excelUrl,
                wordUrl,
                fileName,
              },
            });
            console.log("Configuration updated with ID:", updatedConfiguration.id);
            delete uploadSessions[sessionId];
            return { configId: updatedConfiguration.id };
          }
        }
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw new Error("Failed to process the uploaded file");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
