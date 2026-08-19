import { Router } from "express";
import { doorOpeningTypeController } from "./doorOpeningType.controller";
import { auth } from "../../middleware/auth";
import { requirePermission } from "../../middleware/requirePermission";

const router = Router();

router.post(
  "/",
  auth(),
  requirePermission("doorOpeningType.create"),
  doorOpeningTypeController.createDoorOpeningType
);

router.get("/", doorOpeningTypeController.getAllDoorOpeningTypes);

router.patch(
  "/:id",
  auth(),
  requirePermission("doorOpeningType.update"),
  doorOpeningTypeController.updateDoorOpeningType
);

router.delete(
  "/:id",
  auth(),
  requirePermission("doorOpeningType.delete"),
  doorOpeningTypeController.deleteDoorOpeningType
);

export const doorOpeningTypeRoutes = router;