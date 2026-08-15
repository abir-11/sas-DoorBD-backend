import express from 'express';
import { roleController } from './role.controller';
import { auth } from '../../middleware/auth';
import { requirePermission } from '../../middleware/requirePermission';

const router = express.Router();

router.post(
  "/admin/create-role", 
  auth(),requirePermission("role.create"), 
  roleController.createRole
);
router.get( "/admin/all-role",auth(),requirePermission("role.read"),roleController.getAllRoles);
router.get( "/admin/:id",auth(),requirePermission("role.read"),roleController.getSingleRole);
router.patch( "/admin/:id",auth(),requirePermission("role.update"),roleController.updateRole);
router.delete( "/admin/:id",auth(),requirePermission("role.update"),roleController.deleteRole);



export const roleRoutes = router;