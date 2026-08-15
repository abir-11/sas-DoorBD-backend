import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { adminService } from "./admin.service";
import { IUserQuery } from "./admin.interface";

const createUserByAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const result = await adminService.createUserByAdmin(req.body, {
            id: req.user?.id as string,
            roleName: req.user?.roleName as string,
        });
        console.log(result);
       sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Create successfull",
        data: {
            result
        }
    })
  },
);
const getAllUsers = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const result = await adminService.getAllUsers(
      req.query as IUserQuery
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getUserById = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const result = await adminService.getUserById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully!",
    data: result,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const result = await adminService.updateUser(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const result = await adminService.deleteUser(req.params.id as string, req.user?.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully!",
    data: result,
  });
});

export const adminController={
       createUserByAdmin,
       getAllUsers,
       getUserById,
       updateUser,
       deleteUser
}