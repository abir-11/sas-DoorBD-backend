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



export const userController = {
    createUserDB,
 
}