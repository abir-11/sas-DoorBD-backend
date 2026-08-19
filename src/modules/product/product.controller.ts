import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { productService } from "./product.service";
import { productFilterableFields } from "./product.constant";
import pick from "../../utils/pick";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.createProduct(
    req.body,
    req.files as Express.Multer.File[]
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product created successfully!",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, productFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await productService.getAllProducts(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door products retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getSingleProduct(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door product retrieved successfully!",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productService.updateProduct(
    id as string,
    req.body,
    req.files as Express.Multer.File[]
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product updated successfully!",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.deleteProduct(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door product deleted successfully!",
    data: result,
  });
});

export const productController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};