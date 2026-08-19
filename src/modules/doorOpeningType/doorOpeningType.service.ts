import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../utils/AppError";

const createDoorOpeningType = async (payload: { nameEn: string; nameBn: string }) => {
  const isExist = await prisma.doorOpeningType.findFirst({
    where: { OR: [{ nameEn: payload.nameEn }, { nameBn: payload.nameBn }] },
  });

  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, "A Door Opening Type with this English or Bengali name already exists!");
  }

  return await prisma.doorOpeningType.create({ data: payload });
};

const getAllDoorOpeningTypes = async () => {
  return await prisma.doorOpeningType.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const updateDoorOpeningType = async (id: string, payload: Partial<{ nameEn: string; nameBn: string }>) => {
  const isExist = await prisma.doorOpeningType.findUnique({ where: { id } });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Door Opening Type not found!");
  }

  if (payload.nameEn || payload.nameBn) {
    const isNameConflict = await prisma.doorOpeningType.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [{ nameEn: payload.nameEn }, { nameBn: payload.nameBn }] }
        ]
      }
    });

    if (isNameConflict) {
      throw new AppError(httpStatus.CONFLICT, "This name is already used by another Door Opening Type!");
    }
  }

  return await prisma.doorOpeningType.update({ where: { id }, data: payload });
};

const deleteDoorOpeningType = async (id: string) => {
  const isExist = await prisma.doorOpeningType.findUnique({
    where: { id },
    include: { products: true }
  });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Door Opening Type not found!");
  }

  if (isExist.products.length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete! This Door Opening Type is used in existing products.");
  }

  return await prisma.doorOpeningType.delete({ where: { id } });
};

export const doorOpeningTypeService = {
  createDoorOpeningType,
  getAllDoorOpeningTypes,
  updateDoorOpeningType,
  deleteDoorOpeningType,
};