import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_SECRET_KEY_EXPIRES_IN,
    });
    return token;
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const generateCryptoToken = () => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    return token;
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
