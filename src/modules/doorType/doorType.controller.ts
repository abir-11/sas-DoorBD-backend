import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { doorTypeService } from "./doorType.service";

const createDoorType = catchAsync(async (req: Request, res: Response) => {
  const result = await doorTypeService.createDoorType(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Door Type created successfully!",
    data: result,
  });
});

const getAllDoorTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await doorTypeService.getAllDoorTypes();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door Types retrieved successfully!",
    data: result,
  });
});

const updateDoorType = catchAsync(async (req: Request, res: Response) => {
  const result = await doorTypeService.updateDoorType(req.params.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door Type updated successfully!",
    data: result,
  });
});

const deleteDoorType = catchAsync(async (req: Request, res: Response) => {
  const result = await doorTypeService.deleteDoorType(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Door Type deleted successfully!",
    data: result,
  });
});

export const doorTypeController = {
  createDoorType,
  getAllDoorTypes,
  updateDoorType,
  deleteDoorType,
};