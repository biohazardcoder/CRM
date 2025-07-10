import express from "express";
import { getAllProducts, createProduct, updateProduct, deleteProduct,getProductById } from "../controllers/product-controller.js";
import isExisted from "../middlewares/isExisted.js";
const router = express.Router();

router.get("/", isExisted, getAllProducts);
router.get("/:id", isExisted, getProductById);
router.post("/", isExisted, createProduct);
router.put("/:id", isExisted, updateProduct);
router.delete("/:id", isExisted, deleteProduct);

export default router;