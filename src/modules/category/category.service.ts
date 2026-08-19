import { prisma } from "../../lib/prisma";
import { ICreateCategoryPayload, ICategoryFilterRequest, IUpdateCategoryPayload } from "./category.interface";
import { IPaginationOptions } from "../product/product.interface"; // আগের বানানো ইন্টারফেস থেকে
import { categorySearchableFields } from "./category.constant";
import httpStatus from "http-status";
import AppError from "../../utils/AppError";
import { Prisma } from "../../../prisma/generated/prisma/client";

const createCategory = async (
  payload: ICreateCategoryPayload
) => {
  const isExist = await prisma.category.findFirst({
    where: {
      OR: [
        { nameEn: payload.nameEn },
        { nameBn: payload.nameBn },
      ],
    },
  });

  if (isExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Category already exists with this name!"
    );
  }

  const category = await prisma.category.create({
    data: payload,
  });

  return category;
};

const getAllCategories = async (
  filters: ICategoryFilterRequest,
  options: IPaginationOptions
) => {
  const {
    limit = 10,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const skip = (Number(page) - 1) * Number(limit);

  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.CategoryWhereInput[] = [];

  // Search
  if (searchTerm) {
    andConditions.push({
      OR: categorySearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Filtering
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0
      ? { AND: andConditions }
      : {};

  const result = await prisma.category.findMany({
    where: whereConditions,

    skip,
    take: Number(limit),

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  const total = await prisma.category.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};

// 🔹 3. Get Single Category
const getSingleCategory = async (id: string) => {
  const result = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: true,
      products: true 
    }
  });

  if (!result) throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  return result;
};

// 🔹 4. Update Category
const updateCategory = async (id: string, payload: IUpdateCategoryPayload) => {
  const isExist = await prisma.category.findUnique({ where: { id } });
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, "Category not found!");

  if (payload.parentId && payload.parentId === id) {
    throw new AppError(httpStatus.BAD_REQUEST, "A category cannot be its own parent.");
  }

  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });

  return result;
};

// 🔹 5. Delete Category
const deleteCategory = async (id: string) => {
  const isExist = await prisma.category.findUnique({ 
    where: { id },
    include: { _count: { select: { products: true, children: true } } }
  });

  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, "Category not found!");

  if (isExist._count.products > 0 || isExist._count.children > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST, 
      "Cannot delete this category because it contains products or sub-categories. Please delete or move them first."
    );
  }

  const result = await prisma.category.delete({ where: { id } });
  return result;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory
};