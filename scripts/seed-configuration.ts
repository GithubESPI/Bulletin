const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.configuration.create({
    data: {
      id: "generated-configuration-id",
      fileName: "example.xlsx",
      excelUrl: "https://example.com/path-to-your-excel-file",
      wordUrl: "https://example.com/path-to-your-word-file",
      model: "semestriels",
      userId: "clyscxjq1000611glcclfihn6",
      generatedExcelUrl: "https://example.com/path-to-generated-excel-file",
    },
  });
}

main()
  .then(() => console.log("Configuration created!"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
