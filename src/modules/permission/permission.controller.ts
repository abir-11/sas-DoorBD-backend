import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { permissionService } from "./permission.service";

const createPermission = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await permissionService.createPermissionDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Permission created successfully!",
      data: result,
    });
  },
);
const getAllPermissions = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const result = await permissionService.getAllPermissions(
      req.query
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Permissions retrieved successfully!",
      data: result,
    });
  }
);

const updatePermission = catchAsync(async (req: Request, res: Response) => {
  const result = await permissionService.updatePermission(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Permission updated successfully!",
    data: result,
  });
});

const getPermissionById = catchAsync(async (req: Request, res: Response) => {
  const result = await permissionService.getPermissionById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Permission fetched successfully!",
    data: result,
  });
});

const deletePermission = catchAsync(async (req: Request, res: Response) => {
  const result = await permissionService.deletePermission(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Permission deleted successfully!",
    data: result,
  });
});

export const permissionController = {
  createPermission,
  getAllPermissions,
  updatePermission,
  getPermissionById,
  deletePermission
};