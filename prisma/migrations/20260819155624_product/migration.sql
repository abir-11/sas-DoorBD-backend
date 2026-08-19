/*
  Warnings:

  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionBn` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionEn` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `doorType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `finish` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `hasFingerprint` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `hasPin` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `hasRFID` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `hasRemote` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `installationAvailable` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `installationCharge` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isSmart` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `lockType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `openingType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `securityLevel` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `thickness` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `warrantyMonths` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `products` table. All the data in the column will be lost.
  - Made the column `nameEn` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nameBn` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descriptionEn` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descriptionBn` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProductBadge" AS ENUM ('NEW_ARRIVAL', 'OFFER', 'DISCOUNT', 'REGULAR');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('INSTANT_DELIVERY', 'EXPRESS_DELIVERY', 'STANDARD_DELIVERY');

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- DropIndex
DROP INDEX "categories_parentId_idx";

-- DropIndex
DROP INDEX "categories_status_idx";

-- DropIndex
DROP INDEX "products_categoryId_idx";

-- DropIndex
DROP INDEX "products_doorType_idx";

-- DropIndex
DROP INDEX "products_material_idx";

-- DropIndex
DROP INDEX "products_sku_key";

-- DropIndex
DROP INDEX "products_status_idx";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "createdAt",
DROP COLUMN "descriptionBn",
DROP COLUMN "descriptionEn",
DROP COLUMN "image",
DROP COLUMN "parentId",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "brand",
DROP COLUMN "color",
DROP COLUMN "currency",
DROP COLUMN "doorType",
DROP COLUMN "finish",
DROP COLUMN "hasFingerprint",
DROP COLUMN "hasPin",
DROP COLUMN "hasRFID",
DROP COLUMN "hasRemote",
DROP COLUMN "height",
DROP COLUMN "installationAvailable",
DROP COLUMN "installationCharge",
DROP COLUMN "isAvailable",
DROP COLUMN "isSmart",
DROP COLUMN "lockType",
DROP COLUMN "material",
DROP COLUMN "model",
DROP COLUMN "openingType",
DROP COLUMN "securityLevel",
DROP COLUMN "sku",
DROP COLUMN "thickness",
DROP COLUMN "thumbnail",
DROP COLUMN "warrantyMonths",
DROP COLUMN "width",
ADD COLUMN     "doorMaterialId" TEXT,
ADD COLUMN     "doorOpeningId" TEXT,
ADD COLUMN     "doorTypeId" TEXT,
ALTER COLUMN "nameEn" SET NOT NULL,
ALTER COLUMN "nameBn" SET NOT NULL,
ALTER COLUMN "descriptionEn" SET NOT NULL,
ALTER COLUMN "descriptionBn" SET NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- DropEnum
DROP TYPE "DoorMaterial";

-- DropEnum
DROP TYPE "DoorOpeningType";

-- DropEnum
DROP TYPE "DoorType";

-- CreateTable
CREATE TABLE "door_materials" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "door_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "door_opening_types" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "door_opening_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "door_types" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "door_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "door_materials_nameEn_key" ON "door_materials"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "door_materials_nameBn_key" ON "door_materials"("nameBn");

-- CreateIndex
CREATE UNIQUE INDEX "door_opening_types_nameEn_key" ON "door_opening_types"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "door_opening_types_nameBn_key" ON "door_opening_types"("nameBn");

-- CreateIndex
CREATE UNIQUE INDEX "door_types_nameEn_key" ON "door_types"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "door_types_nameBn_key" ON "door_types"("nameBn");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_doorTypeId_fkey" FOREIGN KEY ("doorTypeId") REFERENCES "door_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_doorMaterialId_fkey" FOREIGN KEY ("doorMaterialId") REFERENCES "door_materials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_doorOpeningId_fkey" FOREIGN KEY ("doorOpeningId") REFERENCES "door_opening_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
