import { db } from "@/lib/db";

async function fetchDocumentUrls(userId: string) {
  try {
    const configuration = await db.configuration.findFirst({
      where: { userId: userId },
    });

    if (!configuration) {
      throw new Error("No configuration found for the user.");
    }

    return {
      excelUrl: configuration.excelUrl,
      wordUrl: configuration.wordUrl,
    };
  } catch (error) {
    console.error("Error fetching document URLs:", error);
    throw error;
  }
}

export default fetchDocumentUrls;
