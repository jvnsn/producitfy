import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { createProduct, deleteProduct, getAllProducts, getMyProducts, getProductById, updateProduct } from "../controllers/productController";




const router = Router();

router.get("/", getAllProducts);

router.get("/my", requireAuth(), getMyProducts);

router.get("/:id", getProductById);

router.post("/", requireAuth(), createProduct);

router.put("/:id", requireAuth(), updateProduct);

router.delete("/:id", requireAuth(), deleteProduct);

export default router;