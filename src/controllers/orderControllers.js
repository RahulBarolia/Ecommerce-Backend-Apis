import Address from "../models/Address.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const fetchOrders = async (req, res) => {
  try {
    const orderItems = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({ orderItems: orderItems });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const addOrderDetails = async (req, res) => {
  console.log(req.body);
  const { _id: userId } = req.user;

  try {
    const selectedAddress = await Address.findOne({
      user: userId,
      isSelected: true,
    });

    if (!selectedAddress) {
      return res.status(400).json({ message: "No address selected" });
    }

    const cartItems = await Cart.find({ user: userId }).populate("product");

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmounts = cartItems.reduce(
      (sum, item) => sum + item.product.productPrice * item.quantity,
      0
    );

    const order = new Order({
      user: userId,
      address: selectedAddress._id,
      items: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.productPrice,
      })),
      totalAmounts: parseInt(totalAmounts),
      status: "Shipped",
      paymentStatus: "Completed",
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "items.product",
      });

    await Cart.deleteMany({ user: userId });

    return res.status(200).json({ order: populatedOrder });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({ message: error.message });
  }
};
