import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { requirePermission } from "../../middleware/requirePermission";



const router=Router();


router.post(
  "/create-by-admin",auth(),requirePermission("user.create"),
  adminController.createUserByAdmin,
);
router.get("/admin/all-user",auth(),requirePermission("user.read"),adminController.getAllUsers);

router.get("/admin/users/:id",auth(),requirePermission("user.read"),adminController.getUserById);
router.patch("/admin/users/:id",auth(),requirePermission("user.update"),adminController.updateUser);

router.delete("/admin/users/:id",auth(),requirePermission("user.delete"),adminController.deleteUser);


export const adminRouter=router;