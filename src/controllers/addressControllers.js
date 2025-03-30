import Address from "../models/Address.js";
import mongoose, { Types } from "mongoose";

export const addAddress = async (req, res) => {
  const {
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    mobileNum,
    fullName,
  } = req.body;

  const { _id: userId } = req.user;

  try {
    if (
      !addressLine1 ||
      !city ||
      !state ||
      !pincode ||
      !mobileNum ||
      !fullName
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (mobileNum.length !== 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be exactly 10 digits long." });
    }

    const address = new Address({
      addressLine1,
      addressLine2:
        addressLine2 && addressLine2.trim().length ? addressLine2 : null,
      city,
      state,
      pincode,
      mobileNum,
      user: userId,
      fullName,
    });

    await address.save();

    return res
      .status(201)
      .json({ message: "Address created successfully", address });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const fetchAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!addresses) {
      return res.status(404).json({ message: "Address not found" });
    }

    return res.status(200).json({ addresses: addresses });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  const { addressId } = req.params;

  const {
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    mobileNum,
    fullName,
  } = req.body;

  try {
    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    if (mobileNum && mobileNum.length !== 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be exactly 10 digits long." });
    }

    const updateExistingAddress = await Address.findById(addressId);

    if (!updateExistingAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    updateExistingAddress.addressLine1 =
      addressLine1 || updateExistingAddress.addressLine1;
    updateExistingAddress.addressLine2 =
      addressLine2 || updateExistingAddress.addressLine2;
    updateExistingAddress.city = city || updateExistingAddress.city;
    updateExistingAddress.state = state || updateExistingAddress.state;
    updateExistingAddress.pincode = pincode || updateExistingAddress.pincode;
    updateExistingAddress.mobileNum =
      mobileNum || updateExistingAddress.mobileNum;
    updateExistingAddress.fullName = fullName || updateExistingAddress.fullName;

    await updateExistingAddress.save();

    return res
      .status(200)
      .json({ message: "Address updated successfully", updateExistingAddress });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const selectAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    const address = await Address.findOne({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await Address.updateMany(
      { user: req.user._id, _id: { $ne: addressId } },
      { $set: { isSelected: false } }
    );

    if (!address.isSelected) {
      address.isSelected = true;
    } else {
      address.isSelected = false;
      address.save();
      return res
        .status(200)
        .json({ message: "Address unselected successfully", address });
    }

    address.save();

    return res
      .status(200)
      .json({
        message: "Address selected successfully",
        selectedAddress: address,
      });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  const { addressId } = req.params;
  try {
    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid id or not found" });
    }

    const existingAddress = await Address.findById(addressId);

    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    await existingAddress.deleteOne();

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};
