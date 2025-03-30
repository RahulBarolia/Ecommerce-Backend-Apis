import express from "express";
import { protectRoute } from "../middlewares/auth.middlewares.js";
import {
  addAddress,
  deleteAddress,
  fetchAddress,
  selectAddress,
  updateAddress,
} from "../controllers/addressControllers.js";

const router = express.Router();

router.post("/", protectRoute, addAddress);

router.get("/", protectRoute, fetchAddress);

router.patch("/:addressId", protectRoute, updateAddress);

router.patch("/:addressId/select", protectRoute, selectAddress);

router.delete("/:addressId", protectRoute, deleteAddress);

export default router;
