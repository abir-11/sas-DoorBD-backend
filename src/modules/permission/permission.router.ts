

import { Router } from "express";
import { permissionController } from "./permission.controller";
import { requirePermission } from "../../middleware/requirePermission";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", permissionController.createPermission);
router.get("/",auth(),requirePermission("permission.read"), permissionController.getAllPermissions);
router.patch("/:id",auth(),requirePermission("permission.update"), permissionController.updatePermission);
router.get("/:id",auth(),requirePermission("permission.read"), permissionController.getPermissionById);
router.delete( "/:id",auth(),requirePermission("permission.delete"),permissionController.deletePermission);

export const permissionRouter = router;