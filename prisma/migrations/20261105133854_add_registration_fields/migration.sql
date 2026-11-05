/*
  Warnings:

  - Made the column `phone` on table `Branch` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `passwordHash` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Business` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `passwordHash` to the `Charity` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Charity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Charity` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- Update Branch
ALTER TABLE "Branch"
ALTER COLUMN "phone" SET NOT NULL;

-- Update Business
ALTER TABLE "Business"
ALTER COLUMN "email" SET NOT NULL;

-- Update Charity
ALTER TABLE "Charity"
ADD COLUMN "description" TEXT,
ADD COLUMN "website" TEXT,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- Update User
ALTER TABLE "User"
ADD COLUMN "address" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "country" TEXT NOT NULL DEFAULT 'South Africa',
ADD COLUMN "phone" TEXT NOT NULL,
ADD COLUMN "suburb" TEXT;