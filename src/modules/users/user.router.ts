import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";




const router=Router();


router.post("/register",userController.createUserDB);



export const userRouter=router;