/*
  Warnings:

  - You are about to drop the column `picture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "maidId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "picture",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "password" TEXT;
