/*
  Warnings:

  - A unique constraint covering the columns `[collectionTokenHash]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "collectedAt" TIMESTAMP(3),
ADD COLUMN     "collectionTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "collectionTokenHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_collectionTokenHash_key" ON "Reservation"("collectionTokenHash");
