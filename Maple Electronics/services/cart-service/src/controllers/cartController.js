const Cart = require('../models/Cart');
const Product = require('../models/Product');

const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);

// GET CART
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
        totalAmount: 0
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD ITEM
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [],
        totalAmount: 0
      });
    }

    const index = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        priceAtAdd: product.price
      });
    }

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ITEM
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.quantity = quantity;
    cart.totalAmount = calculateTotal(cart.items);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE ITEM
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.json({ message: 'Cart already empty' });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};