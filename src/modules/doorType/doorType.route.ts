import { Router } from "express";
import { doorTypeController } from "./doorType.controller";
import { auth } from "../../middleware/auth";
import { requirePermission } from "../../middleware/requirePermission";

const router = Router();

router.post(
  "/",
  auth(),
  requirePermission("doorType.create"),
  doorTypeController.createDoorType
);

router.get("/", doorTypeController.getAllDoorTypes);

router.patch(
  "/:id",
  auth(),
  requirePermission("doorType.update"),
  doorTypeController.updateDoorType
);

router.delete(
  "/:id",
  auth(),
  requirePermission("doorType.delete"),
  doorTypeController.deleteDoorType
);

export const doorTypeRoutes = router;