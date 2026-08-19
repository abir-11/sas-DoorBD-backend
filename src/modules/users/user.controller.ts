import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"


const createUserDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.createUserDB(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Create successfull",
        data: {
            result
        }
    })
});

const getMe = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User not authenticated!");
    }

    const result = await userService.getMeDB(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully!",
      data: result,
    });
  },
);
const updateProfile = catchAsync(
  async (req: Request, res: Response,next:NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User not authenticated!");
    }

    const file = req.file;

    const result = await userService.updateProfileDB(
      userId,
      req.body,
      file,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully!",
      data: result,
    });
  },
);



export const userController = {
    createUserDB,
    getMe,
    updateProfile
 
}