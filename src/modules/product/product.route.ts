import { Router } from "express";
import { productController } from "./product.controller";
import { auth } from "../../middleware/auth";
import { requirePermission } from "../../middleware/requirePermission";
import { upload } from "../../middleware/upload";

const router = Router();

router.post(
  "/",
  auth(), 
   requirePermission("product.create"),
  upload.array("images", 5), 
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  productController.createProduct 
);

router.get(
  "/",
  productController.getAllProducts
);

router.get(
  "/:id",
  productController.getSingleProduct
);

router.patch(
  "/:id",
  auth(),
  requirePermission("product.update"),
  upload.array("images", 5),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  productController.updateProduct
);

router.delete(
  "/:id",
  auth(),
  requirePermission("product.delete"),
  productController.deleteProduct
);

export const productRouter = router;