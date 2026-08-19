import { Router } from "express";
import { doorMaterialController } from "./doorMaterial.controller";
import { auth } from "../../middleware/auth";
import { requirePermission } from "../../middleware/requirePermission";

const router = Router();

router.post(
  "/",
  auth(),
  requirePermission("doorMaterial.create"),
  doorMaterialController.createDoorMaterial
);

router.get("/", doorMaterialController.getAllDoorMaterials);

router.patch(
  "/:id",
  auth(),
  requirePermission("doorMaterial.update"),
  doorMaterialController.updateDoorMaterial
);

router.delete(
  "/:id",
  auth(),
  requirePermission("doorMaterial.delete"),
  doorMaterialController.deleteDoorMaterial
);

export const doorMaterialRoutes = router;