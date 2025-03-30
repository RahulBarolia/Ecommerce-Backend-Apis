import express from "express";
import { protectRoute } from "../middlewares/auth.middlewares.js";
import {
  addWishlistProduct,
  clearWishlist,
  deleteWishlistProduct,
  getWishlistProducts,
} from "../controllers/wishlistControllers.js";

const router = express.Router();

router.post("/:productId", protectRoute, addWishlistProduct);

router.get("/", protectRoute, getWishlistProducts);

router.delete("/clear", protectRoute, clearWishlist);

router.delete("/:wishlistId", protectRoute, deleteWishlistProduct);

export default router;
