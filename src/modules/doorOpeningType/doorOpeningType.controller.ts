import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { doorOpeningTypeService } from "./doorOpeningType.service";

const createDoorOpeningType = catchAsync(async (req: Request, res: Response) => {
  const result = await doorOpeningTypeService.createDoorOpeningType(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Door Opening Type created successfully!",
    data: result,
  });
});

const getAllDoorOpeningTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await doorOpeningTypeService.getAllDoorOpeningTypes();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door Opening Types retrieved successfully!",
    data: result,
  });
});

const updateDoorOpeningType = catchAsync(async (req: Request, res: Response) => {
  const result = await doorOpeningTypeService.updateDoorOpeningType(req.params.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door Opening Type updated successfully!",
    data: result,
  });
});

const deleteDoorOpeningType = catchAsync(async (req: Request, res: Response) => {
  const result = await doorOpeningTypeService.deleteDoorOpeningType(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door Opening Type deleted successfully!",
    data: result,
  });
});

export const doorOpeningTypeController = {
  createDoorOpeningType,
  getAllDoorOpeningTypes,
  updateDoorOpeningType,
  deleteDoorOpeningType,
};