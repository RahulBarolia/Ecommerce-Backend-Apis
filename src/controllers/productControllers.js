import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
export const addProduct = async (req, res) => {
  const {
    productName,
    productImageUrl,
    category,
    productPrice,
    productDescription,
  } = req.body;
  try {
    if (
      !productName ||
      !productImageUrl ||
      !category ||
      !productPrice ||
      !productDescription
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    const product = new Product({
      productName,
      productDescription,
      productImageUrl,
      productPrice,
      category,
    });

    await product.save();

    return res
      .status(201)
      .json({ message: "Product added successfully", product });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ products });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const fetchProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    const product = await Product.findById(productId);
    return res.status(200).json({ product: product });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const filterByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    const filterProducts = await Product.find({
      category: categoryId,
    }).populate("category");

    return res.status(200).json({ filterProducts });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      const allProducts = await Product.find().populate("category");
      return res.status(200).json({ products: allProducts });
    }

    const products = await Product.find().populate("category");

    const searchProduct = query.toLowerCase();

    const filteredProducts = products.filter(
      (product) =>
        product?.productName?.toLowerCase().includes(searchProduct) ||
        product?.category?.categoryName?.toLowerCase().includes(searchProduct)
    );

    return res.status(200).json({ products: filteredProducts });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};
