import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { upload } from "../../middleware/upload";




const router=Router();


router.post("/register",userController.createUserDB);
router.get("/me",auth(),userController.getMe);
router.patch("/profile-update", auth(),upload.single("profilePhoto"),userController.updateProfile,);



export const userRouter=router;