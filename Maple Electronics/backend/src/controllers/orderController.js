const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) return res.status(400).json({ message: 'Product no longer available' });
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: 'Insufficient stock for ' + product.name + '. Available: ' + product.stock
        });
      }
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        productId: item.productId._id,
        vendorId: product.vendorId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtAdd
      });
    }

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      status: 'PLACED',
      shippingAddress,
      trackingNumber: 'TRK' + Date.now() + Math.floor(Math.random() * 1000)
    });

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    await order.populate('items.productId', 'name brand price images');
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId', 'name brand price images')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('items.productId', 'name brand price')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.productId',
      'name brand price images'
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus };
