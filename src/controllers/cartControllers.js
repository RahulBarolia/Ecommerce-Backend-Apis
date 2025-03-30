import mongoose from "mongoose";
import Cart from "../models/Cart.js";

export const addCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const { _id: userId } = req.user;
  try {
    if (!productId || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    const existingProduct = await Cart.findOne({
      product: productId,
      user: userId,
    });

    if (existingProduct) {
      return res.status(400).json({ message: "Product already exist in cart" });
    }

    const cart = new Cart({
      user: userId,
      product: productId,
      quantity,
    });

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("product");

    return res.status(201).json({ cart: populatedCart });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const fetchCarts = async (req, res) => {
  try {
    const carts = await Cart.find({ user: req.user._id })
      .sort({
        createdAt: -1,
      })
      .populate("product");

    if (!carts) {
      return res.status(404).json({ message: "Carts not found" });
    }

    return res.status(200).json({ carts: carts });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const increaseQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { cartId } = req.params;
  try {
    if (!quantity || !cartId) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    const cart = await Cart.findById(cartId);

    if (cart.quantity < 5) {
      cart.quantity += 1;
      await cart.save();
    } else {
      return res
        .status(400)
        .json({ message: "Maximum quantity limit reached (5 items)" });
    }

    const populatedCart = await Cart.findById(cart._id).populate("product");

    return res.status(200).json({ cart: populatedCart });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const decreaseQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { cartId } = req.params;
  try {
    if (!quantity || !cartId) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    const cart = await Cart.findById(cartId);

    if (cart.quantity > 1 && cart.quantity <= 5) {
      cart.quantity -= 1;
      await cart.save();
    } else {
      return res
        .status(400)
        .json({ message: "Minimum quantity limit reached (1 item)" });
    }

    const populatedCart = await Cart.findById(cart._id).populate("product");

    return res.status(200).json({ cart: populatedCart });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await cart.deleteOne();

    return res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    await Cart.deleteMany({ user: userId });
    return res.status(200).json({ message: "All items removed from cart" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};
