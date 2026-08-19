import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { requirePermission } from "../../middleware/requirePermission";

const router = Router();

router.post(
  "/",
  auth(),
  requirePermission("category.create"), 
  categoryController.createCategory
);

router.get(
  "/",
  categoryController.getAllCategories
);

router.get(
  "/:id",
  categoryController.getSingleCategory
);

router.patch(
  "/:id",
  auth(),
  requirePermission("category.update"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  auth(),
  requirePermission("category.delete"),
  categoryController.deleteCategory
);

export const categoryRouter = router;