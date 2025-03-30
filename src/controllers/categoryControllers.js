import Category from "../models/Category.js";

export const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ categoryName });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exist" });
    }

    const category = new Category({ categoryName });

    await category.save();

    return res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).json({ categories });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};
