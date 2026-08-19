import { prisma } from "../../lib/prisma";
import { ICreateProductPayload, IProductFilterRequest, IPaginationOptions, IUpdateProductPayload } from "./product.interface";
import httpStatus from "http-status";
import { DeliveryType, Prisma, ProductBadge } from "../../../prisma/generated/prisma/client";
import AppError from "../../utils/AppError";
import { uploadToCloudinary } from './../../utils/uploadToCloudinary';
import { sendImageToCloudinary } from "../../config/cloudinary";

// 🔹 Create Product Logic
const createProduct = async (
  payload: ICreateProductPayload,
  files?: Express.Multer.File[]
) => {
  const { 
    language, 
    name, 
    description, 
    categoryId, 
    doorTypeId, 
    doorMaterialId, 
    doorOpeningId, 
    price,
    discountPrice,
    stock = 0,
    badge,
    deliveryType = DeliveryType.STANDARD_DELIVERY,
    images: _payloadImages,
    ...restData 
  } = payload;

 
  if (!["EN", "BN"].includes(language)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Language must be either 'EN' or 'BN'");
  }

  const numericPrice = Number(price);
  const numericDiscountPrice = discountPrice ? Number(discountPrice) : undefined;
  const numericStock = Number(stock);

  if (numericDiscountPrice && numericDiscountPrice >= numericPrice) {
    throw new AppError(httpStatus.BAD_REQUEST, "Discount price must be less than original price!");
  }

  let finalBadge = badge as ProductBadge | undefined;
  if (numericDiscountPrice && !badge) {
    finalBadge = ProductBadge.DISCOUNT;
  }

  if (deliveryType === DeliveryType.INSTANT_DELIVERY && numericStock <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Instant delivery product must have stock greater than 0!");
  }

  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }
  if (doorTypeId) {
    const doorType = await prisma.doorType.findUnique({ where: { id: doorTypeId } });
    if (!doorType) throw new AppError(httpStatus.NOT_FOUND, "Door Type not found!");
  }
  if (doorMaterialId) {
    const doorMaterial = await prisma.doorMaterial.findUnique({ where: { id: doorMaterialId } });
    if (!doorMaterial) throw new AppError(httpStatus.NOT_FOUND, "Door Material not found!");
  }
  if (doorOpeningId) {
    const doorOpeningType = await prisma.doorOpeningType.findUnique({ where: { id: doorOpeningId } });
    if (!doorOpeningType) throw new AppError(httpStatus.NOT_FOUND, "Door Opening Type not found!");
  }


let imageUrls: string[] = [];

if (files && files.length > 0) {
  const uploadPromises = files.map((file, index) => {
    const sanitizedName = name ? name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() : "product";
    const imageName = `${sanitizedName}-${Date.now()}-${index + 1}`;

    return sendImageToCloudinary(imageName, file.buffer);
  });

  const uploadResults = await Promise.all(uploadPromises);
  imageUrls = uploadResults.map((result) => result.secure_url);
}


  const product = await prisma.product.create({
    data: {
      nameBn: language === "BN" ? name : "",
      nameEn: language === "EN" ? name : "",
      descriptionBn: language === "BN" ? description : "",
      descriptionEn: language === "EN" ? description : "",

      price: numericPrice,
      discountPrice: numericDiscountPrice,
      stock: numericStock,
      badge: finalBadge || ProductBadge.REGULAR,
      deliveryType: deliveryType as DeliveryType,

      images: imageUrls, 

      categoryId,
      doorTypeId,
      doorMaterialId,
      doorOpeningId,
      ...restData,
    },
    include: {
      category: true,
      doorType: true,
      doorMaterial: true,
      doorOpeningType: true,
    },
  });

  return product;
};

const productSearchableFields = ["nameBn", "nameEn", "descriptionBn", "descriptionEn"] as const;
const productBooleanFields: string[] = ["isActive"];

// 🔹 Get All Products Logic (
const getAllProducts = async (filters: IProductFilterRequest, options: IPaginationOptions) => {
  const { limit = 10, page = 1, sortBy = "createdAt", sortOrder = "desc" } = options;
  const skip = (Number(page) - 1) * Number(limit);

  const { searchTerm, ...filterData } = filters;
  const andConditions: Prisma.ProductWhereInput[] = [];

  // Search Logic
  if (searchTerm) {
    andConditions.push({
      OR: productSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (productBooleanFields.includes(key)) {
          return { [key]: { equals: filterData[key as keyof typeof filterData] === "true" } };
        }
        return { [key]: { equals: (filterData as any)[key] } };
      }),
    });
  }

  const whereConditions: Prisma.ProductWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: { [sortBy]: sortOrder },
    include: {
      category: true,
      doorType: true,
      doorMaterial: true,
      doorOpeningType: true,
    },
  });

  const total = await prisma.product.count({ where: whereConditions });

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

const getSingleProduct = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!result) throw new AppError(httpStatus.NOT_FOUND, "Product not found!");
  return result;
};

const updateProduct = async (
  id: string,
  payload: IUpdateProductPayload,
  files?: Express.Multer.File[]
) => {
  // ১. প্রোডাক্ট ডাটাবেসে আছে কিনা চেক
  const isExist = await prisma.product.findUnique({ where: { id } });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found!");
  }

  const {
    language,
    name,
    description,
    categoryId,
    doorTypeId,
    doorMaterialId,
    doorOpeningId,
    price,
    discountPrice,
    stock,
    badge,
    deliveryType,
    images, 
    ...restData
  } = payload;

  const updateData: Record<string, any> = { ...restData };

  if (language && (name || description)) {
    if (!["EN", "BN"].includes(language)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Language must be either 'EN' or 'BN'");
    }
    if (language === "BN") {
      if (name) updateData.nameBn = name;
      if (description) updateData.descriptionBn = description;
    } else if (language === "EN") {
      if (name) updateData.nameEn = name;
      if (description) updateData.descriptionEn = description;
    }
  }

  // ৩. প্রাইস ও স্টক ভ্যালিডেশন
  const currentPrice = price !== undefined ? Number(price) : isExist.price;
  const currentDiscount = discountPrice !== undefined ? Number(discountPrice) : isExist.discountPrice;

  if (currentDiscount && currentDiscount >= currentPrice) {
    throw new AppError(httpStatus.BAD_REQUEST, "Discount price must be less than original price!");
  }

  if (price !== undefined) updateData.price = Number(price);
  if (discountPrice !== undefined) updateData.discountPrice = Number(discountPrice);
  if (stock !== undefined) updateData.stock = Number(stock);
  if (badge) updateData.badge = badge;
  if (deliveryType) updateData.deliveryType = deliveryType;

 

  let finalImages: string[] = isExist.images; 

  if (images && Array.isArray(images)) {
    finalImages = images;
  }

  if (files && files.length > 0) {
  const productName = name || isExist.nameEn || isExist.nameBn || "product";
  const sanitizedName = productName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

  const uploadPromises = files.map((file, index) => {
    const imageName = `${sanitizedName}-${Date.now()}-${index + 1}`;
    
    return sendImageToCloudinary(imageName, file.buffer);
  });

  const uploadResults = await Promise.all(uploadPromises);
  const newUploadedUrls = uploadResults.map((result) => result.secure_url);

  finalImages = [...finalImages, ...newUploadedUrls];
}

  updateData.images = finalImages;

  const result = await prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      doorType: true,
      doorMaterial: true,
      doorOpeningType: true,
    },
  });

  return result;
};

const deleteProduct = async (id: string) => {
  const isExist = await prisma.product.findUnique({ where: { id } });
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, "Product not found!");

  const result = await prisma.product.delete({
    where: { id }
  });
  return result;
};

export const productService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};