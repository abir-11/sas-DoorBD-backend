import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rolePermissionService } from "./rolePermission.service";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from 'http-status';


const assignPermissionsToRole = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const { roleId } = req.params;

    const { permissionIds } = req.body;

    const result =
      await rolePermissionService.assignPermissionsToRole(
        roleId as string,
        permissionIds
      );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Permissions assigned to role successfully!",
      data: result,
    });
  }
);
const updatePermissions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { roleId } = req.params;
  const { permissionIds } = req.body;
  const result = await rolePermissionService.updatePermissionsForRole(roleId as string, permissionIds);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Role permissions synchronized successfully!",
    data: result,
  });
});

const removePermissions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { roleId } = req.params;
  const { permissionIds } = req.body;
  const result = await rolePermissionService.removePermissionsFromRole(roleId as string, permissionIds);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Permissions removed successfully!",
    data: result,
  });
});

const getPermissions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { roleId } = req.params;
  const result = await rolePermissionService.getPermissionsByRoleId(roleId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Role permissions fetched successfully!",
    data: result,
  });
});






export const rolePermissionController={
   assignPermissionsToRole,
  updatePermissions,
  removePermissions,
  getPermissions,
}