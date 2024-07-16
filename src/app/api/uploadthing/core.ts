import { db } from "@/db";
import ExcelJS from "exceljs";
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

        // Process Excel file if it's an Excel file
        if (uploadedFile.name.endsWith(".xls") || uploadedFile.name.endsWith(".xlsx")) {
          console.log("Processing Excel file:", uploadedFile.url);
          const excelRes = await fetch(uploadedFile.url);
          if (!excelRes.ok) {
            console.error("Failed to fetch the Excel file:", excelRes.statusText);
            throw new Error(`Failed to fetch the Excel file: ${excelRes.statusText}`);
          }
          const excelBuffer = await excelRes.arrayBuffer();
          console.log("Excel file fetched successfully");

          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(excelBuffer);
          console.log("Excel workbook loaded successfully");

          const worksheet = workbook.getWorksheet(1);
          const excelData: any[] = [];

          if (worksheet) {
            worksheet.eachRow((row) => {
              excelData.push(row.values);
            });
            console.log("Worksheet processed successfully");
          } else {
            console.error("Worksheet not found in the Excel file.");
            throw new Error("Worksheet not found");
          }

          uploadSessions[sessionId].excelUrl = uploadedFile.url;
        }

        // Process Word file if it's a Word file
        if (uploadedFile.name.endsWith(".doc") || uploadedFile.name.endsWith(".docx")) {
          console.log("Processing Word file:", uploadedFile.url);
          const wordRes = await fetch(uploadedFile.url);
          if (!wordRes.ok) {
            console.error("Failed to fetch the Word file:", wordRes.statusText);
            throw new Error(`Failed to fetch the Word file: ${wordRes.statusText}`);
          }
          const wordBuffer = await wordRes.arrayBuffer();
          console.log("Word file fetched successfully");

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
