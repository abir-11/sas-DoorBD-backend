import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../utils/AppError";

const createDoorMaterial = async (payload: { nameEn: string; nameBn: string }) => {
  const isExist = await prisma.doorMaterial.findFirst({
    where: { OR: [{ nameEn: payload.nameEn }, { nameBn: payload.nameBn }] },
  });

  if (isExist) throw new AppError(httpStatus.CONFLICT, "Door Material already exists with this name!");

  return await prisma.doorMaterial.create({ data: payload });
};

const getAllDoorMaterials = async () => {
  return await prisma.doorMaterial.findMany({ orderBy: { createdAt: "desc" } });
};

const updateDoorMaterial = async (id: string, payload: Partial<{ nameEn: string; nameBn: string }>) => {
  const isExist = await prisma.doorMaterial.findUnique({ where: { id } });
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, "Door Material not found!");

  if (payload.nameEn || payload.nameBn) {
    const isNameConflict = await prisma.doorMaterial.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [{ nameEn: payload.nameEn }, { nameBn: payload.nameBn }] }
        ]
      }
    });

    if (isNameConflict) throw new AppError(httpStatus.CONFLICT, "This material name is already in use!");
  }

  return await prisma.doorMaterial.update({ where: { id }, data: payload });
};

const deleteDoorMaterial = async (id: string) => {
  const isExist = await prisma.doorMaterial.findUnique({ where: { id }, include: { products: true } });
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, "Door Material not found!");
  
  if (isExist.products.length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete! This material is used in existing products.");
  }

  return await prisma.doorMaterial.delete({ where: { id } });
};

export const doorMaterialService = { createDoorMaterial, getAllDoorMaterials, updateDoorMaterial, deleteDoorMaterial };