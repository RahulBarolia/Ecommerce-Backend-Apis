import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";

export const addWishlistProduct = async (req, res) => {
  const { productId } = req.params;
  const { _id: userId } = req.user;
  try {
    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    const existingProduct = await Wishlist.findOne({
      product: productId,
      user: userId,
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product already exist in wishlist" });
    }

    const wishlist = new Wishlist({
      user: userId,
      product: productId,
    });

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
      "product"
    );

    return res.status(201).json({ wishlistItem: populatedWishlist });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getWishlistProducts = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user._id })
      .populate("product")
      .sort({ createdAt: -1 });
    return res.status(200).json({ wishlistItems: wishlistItems });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteWishlistProduct = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    if (!wishlistId) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
      return res.status(400).json({ message: "Invalid Id or not found" });
    }

    const existingWishlist = await Wishlist.findById(wishlistId);

    if (!existingWishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    await existingWishlist.deleteOne();

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const clearWishlist = async (req, res) => {
  const { _id: userId } = req.user;
  try {
    await Wishlist.deleteMany({ user: userId });
    return res.status(200).json({ message: "All items removed from Wishlist" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};
