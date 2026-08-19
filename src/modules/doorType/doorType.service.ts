import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import AppError from "../../utils/AppError";

// 🔹 Create Door Type
const createDoorType = async (payload: { nameEn: string; nameBn: string }) => {
  const isExist = await prisma.doorType.findFirst({
    where: {
      OR: [{ nameEn: payload.nameEn }, { nameBn: payload.nameBn }],
    },
  });

  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, "A Door Type with this English or Bengali name already exists!");
  }

  return await prisma.doorType.create({ data: payload });
};

// 🔹 Get All
const getAllDoorTypes = async () => {
  return await prisma.doorType.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// 🔹 Update Door Type
const updateDoorType = async (id: string, payload: Partial<{ nameEn: string; nameBn: string }>) => {
  // ১. আইডি চেক: ডাটাবেসে এই আইডি আছে কিনা
  const isExist = await prisma.doorType.findUnique({ where: { id } });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Door Type not found!");
  }

  // ২. ডুপ্লিকেট নাম চেক: নতুন নাম অন্য কোনো আইডির সাথে মিলে যাচ্ছে কিনা
  if (payload.nameEn || payload.nameBn) {
    const isNameConflict = await prisma.doorType.findFirst({
      where: {
        AND: [
          { id: { not: id } }, // বর্তমান আইডি বাদে অন্যগুলোতে খুঁজবে
          { OR: [{ nameEn: payload.nameEn }, { nameBn: payload.nameBn }] }
        ]
      }
    });

    if (isNameConflict) {
      throw new AppError(httpStatus.CONFLICT, "This name is already used by another Door Type!");
    }
  }

  return await prisma.doorType.update({ where: { id }, data: payload });
};

// 🔹 Delete Door Type
const deleteDoorType = async (id: string) => {
  // ১. আইডি চেক
  const isExist = await prisma.doorType.findUnique({ 
    where: { id }, 
    include: { products: true } 
  });
  
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Door Type not found!");
  }
  
  // ২. প্রোডাক্ট রিলেশন চেক
  if (isExist.products.length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete! This Door Type is already used in some products.");
  }

  return await prisma.doorType.delete({ where: { id } });
};

export const doorTypeService = { createDoorType, getAllDoorTypes, updateDoorType, deleteDoorType };