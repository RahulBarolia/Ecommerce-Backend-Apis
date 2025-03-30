import express from "express";
import { protectRoute } from "../middlewares/auth.middlewares.js";
import {
  addOrderDetails,
  fetchOrders,
} from "../controllers/orderControllers.js";

const router = express.Router();

router.post("/verify-payment", protectRoute, addOrderDetails);

router.get("/", protectRoute, fetchOrders);

export default router;
