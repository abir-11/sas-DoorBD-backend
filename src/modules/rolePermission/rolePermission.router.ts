import { Router } from "express";
import { auth } from "../../middleware/auth";
import { rolePermissionController } from "./rolePermission.controller";
import { requirePermission } from "../../middleware/requirePermission";


const router=Router();



router.post(
  "/:roleId/permissions",
  auth(),
  requirePermission("role.create"),
  rolePermissionController.assignPermissionsToRole
);

router.get(
  "/:roleId/permissions",
  auth(),
  requirePermission("role.read"), 
  rolePermissionController.getPermissions
);

router.patch(
  "/:roleId/permissions/sync",
  auth(),
  requirePermission("role.update"), 
  rolePermissionController.updatePermissions
);

router.delete(
  "/:roleId/permissions/remove",
  auth(),
  requirePermission("role.delete"), 
  rolePermissionController.removePermissions
);

export const rolePermissionRouter=router;