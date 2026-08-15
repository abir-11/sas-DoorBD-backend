import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { roleService } from "./role.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await roleService.createRoleWithPermissions(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Role created successfully with permissions!",
    data: result,
  });
});
const getAllRoles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await roleService.getAllRoles(req.user?.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Roles retrieved successfully!",
    data: result,
  });
});

const getSingleRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await roleService.getSingleRole(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Role details retrieved successfully!",
    data: result,
  });
});

const updateRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await roleService.updateRole(id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Role updated successfully!",
    data: result,
  });
});

const deleteRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await roleService.deleteRole(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Role deleted successfully!",
    data: result,
  });
});

export const roleController = {
  createRole,
  getAllRoles,
  getSingleRole,
  updateRole,
  deleteRole,
};