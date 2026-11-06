/*
  Warnings:

  - Added the required column `allergens` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectionInstructions` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "allergens" TEXT NOT NULL,
ADD COLUMN     "collectionInstructions" TEXT NOT NULL,
ADD COLUMN     "ingredients" TEXT,
ADD COLUMN     "storageInstructions" TEXT;
