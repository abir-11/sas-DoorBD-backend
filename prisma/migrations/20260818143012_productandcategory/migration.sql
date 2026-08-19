/*
  Warnings:

  - You are about to drop the column `cropType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `minOrderQty` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `productType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DoorType" AS ENUM ('WOODEN', 'STEEL', 'GLASS', 'ALUMINUM', 'PVC', 'FIRE_RATED', 'SMART', 'SECURITY', 'OTHER');

-- CreateEnum
CREATE TYPE "DoorMaterial" AS ENUM ('WOOD', 'STEEL', 'STAINLESS_STEEL', 'ALUMINUM', 'GLASS', 'PVC', 'COMPOSITE', 'OTHER');

-- CreateEnum
CREATE TYPE "DoorOpeningType" AS ENUM ('SINGLE', 'DOUBLE', 'SLIDING', 'FOLDING', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "LockType" AS ENUM ('KEY', 'DIGITAL', 'PIN', 'FINGERPRINT', 'RFID', 'FACE_RECOGNITION', 'SMART', 'MULTI_LOCK');

-- CreateEnum
CREATE TYPE "SecurityLevel" AS ENUM ('BASIC', 'MEDIUM', 'HIGH', 'PREMIUM');

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_sellerId_fkey";

-- DropIndex
DROP INDEX "products_productType_idx";

-- DropIndex
DROP INDEX "products_sellerId_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "cropType",
DROP COLUMN "expiryDate",
DROP COLUMN "minOrderQty",
DROP COLUMN "productType",
DROP COLUMN "sellerId",
DROP COLUMN "unit",
DROP COLUMN "weight",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "doorType" "DoorType",
ADD COLUMN     "finish" TEXT,
ADD COLUMN     "hasFingerprint" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasPin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasRFID" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasRemote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "installationAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "installationCharge" DOUBLE PRECISION,
ADD COLUMN     "isSmart" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lockType" "LockType",
ADD COLUMN     "material" "DoorMaterial",
ADD COLUMN     "model" TEXT,
ADD COLUMN     "openingType" "DoorOpeningType",
ADD COLUMN     "securityLevel" "SecurityLevel",
ADD COLUMN     "thickness" DOUBLE PRECISION,
ADD COLUMN     "warrantyMonths" INTEGER,
ADD COLUMN     "width" DOUBLE PRECISION;

-- DropEnum
DROP TYPE "ProductType";

-- CreateIndex
CREATE INDEX "products_doorType_idx" ON "products"("doorType");

-- CreateIndex
CREATE INDEX "products_material_idx" ON "products"("material");
