import express from "express";
import {
  login,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/authControllers.js";
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/verify-email", verifyEmail);

router.post("/reset-password", resetPassword);

export default router;
