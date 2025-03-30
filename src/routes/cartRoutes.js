import express from "express";
import {
  addCart,
  clearCart,
  decreaseQuantity,
  deleteCart,
  fetchCarts,
  increaseQuantity,
} from "../controllers/cartControllers.js";
import { protectRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/", protectRoute, addCart);

router.get("/", protectRoute, fetchCarts);

router.put("/increase/:cartId", protectRoute, increaseQuantity);

router.put("/decrease/:cartId", protectRoute, decreaseQuantity);

router.delete("/clear", protectRoute, clearCart);

router.delete("/:cartId", protectRoute, deleteCart);

export default router;
