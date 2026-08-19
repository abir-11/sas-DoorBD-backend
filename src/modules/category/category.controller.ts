import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { categoryService } from "./category.service";
import pick from "../../utils/pick";
import { categoryFilterableFields } from "./category.constant";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.createCategory(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully!",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, categoryFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await categoryService.getAllCategories(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getSingleCategory(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieved successfully!",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.updateCategory(req.params.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully!",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.deleteCategory(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully!",
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory
};