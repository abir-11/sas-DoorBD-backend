/*
  Warnings:

  - You are about to drop the column `roleId` on the `permissions` table. All the data in the column will be lost.
  - The required column `id` was added to the `permissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_roleId_fkey";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "roleId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
