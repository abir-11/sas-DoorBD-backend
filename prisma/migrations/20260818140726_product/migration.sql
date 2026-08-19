-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DRAFT');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('SEED', 'FERTILIZER', 'PESTICIDE', 'EQUIPMENT', 'CROP', 'OTHER');

-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "nameBn" TEXT NOT NULL,
    "descriptionBn" TEXT,
    "image" TEXT,
    "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT,
    "nameBn" TEXT,
    "descriptionEn" TEXT,
    "descriptionBn" TEXT,
    "categoryId" TEXT,
    "productType" "ProductType",
    "brand" TEXT,
    "sku" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "discountPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "minOrderQty" INTEGER NOT NULL DEFAULT 1,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT[],
    "thumbnail" TEXT,
    "sellerId" TEXT NOT NULL,
    "cropType" TEXT,
    "weight" DOUBLE PRECISION,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_status_idx" ON "categories"("status");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "products_sellerId_idx" ON "products"("sellerId");

-- CreateIndex
CREATE INDEX "products_productType_idx" ON "products"("productType");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
