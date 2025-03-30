import express from "express";
import {
  addProduct,
  fetchProductById,
  fetchProducts,
  filterByCategory,
  searchProducts,
} from "../controllers/productControllers.js";

const router = express.Router();

router.post("/", addProduct);

router.get("/", fetchProducts);

router.get("/search", searchProducts);

router.get("/:productId", fetchProductById);

router.get("/:categoryId/products", filterByCategory);

export default router;
