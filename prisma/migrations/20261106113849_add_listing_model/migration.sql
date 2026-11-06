-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('DISCOUNTED', 'DONATION');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'PAUSED', 'SOLD_OUT', 'EXPIRED');

-- CreateEnum
CREATE TYPE "FoodCategory" AS ENUM ('BAKERY', 'PREPARED_MEALS', 'FRUITS_VEGETABLES', 'DAIRY', 'MEAT_SEAFOOD', 'GROCERIES', 'OTHER');

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "FoodCategory" NOT NULL,
    "type" "ListingType" NOT NULL DEFAULT 'DISCOUNTED',
    "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "originalPrice" DECIMAL(10,2),
    "quantityAvailable" INTEGER NOT NULL,
    "quantitySold" INTEGER NOT NULL DEFAULT 0,
    "weightPerItemKg" DECIMAL(8,3),
    "imageUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "collectionStartsAt" TIMESTAMP(3) NOT NULL,
    "collectionEndsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Listing_branchId_idx" ON "Listing"("branchId");

-- CreateIndex
CREATE INDEX "Listing_status_idx" ON "Listing"("status");

-- CreateIndex
CREATE INDEX "Listing_type_idx" ON "Listing"("type");

-- CreateIndex
CREATE INDEX "Listing_collectionEndsAt_idx" ON "Listing"("collectionEndsAt");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
