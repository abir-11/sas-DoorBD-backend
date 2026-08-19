import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { doorMaterialService } from "./doorMaterial.service";

const createDoorMaterial = catchAsync(async (req: Request, res: Response) => {
  const result = await doorMaterialService.createDoorMaterial(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Door Material created successfully!",
    data: result,
  });
});

const getAllDoorMaterials = catchAsync(async (req: Request, res: Response) => {
  const result = await doorMaterialService.getAllDoorMaterials();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door Materials retrieved successfully!",
    data: result,
  });
});

const updateDoorMaterial = catchAsync(async (req: Request, res: Response) => {
  const result = await doorMaterialService.updateDoorMaterial(req.params.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door Material updated successfully!",
    data: result,
  });
});

const deleteDoorMaterial = catchAsync(async (req: Request, res: Response) => {
  const result = await doorMaterialService.deleteDoorMaterial(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door Material deleted successfully!",
    data: result,
  });
});

export const doorMaterialController = {
  createDoorMaterial,
  getAllDoorMaterials,
  updateDoorMaterial,
  deleteDoorMaterial,
};