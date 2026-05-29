const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'shippingAddress is required' });
    }

    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);

      if (!product) {
        return res.status(404).json({
          message: 'Product not found for item in cart'
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: 'Insufficient stock for ' + product.name + '. Available: ' + product.stock
        });
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        productId: product._id,
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

    const populatedOrder = await Order.findById(order._id).populate(
      'items.productId',
      'name brand price'
    );

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId', 'name brand price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.productId', 'name brand price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.productId',
      'name brand price'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const allowedStatuses = ['PLACED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
