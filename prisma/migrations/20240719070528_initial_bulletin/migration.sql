/*
  Warnings:

  - You are about to drop the column `generatedExcelUrl` on the `Configuration` table. All the data in the column will be lost.
  - Added the required column `croppedExcelUrl` to the `Configuration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Configuration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Configuration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "generatedExcelUrl",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "croppedExcelUrl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
