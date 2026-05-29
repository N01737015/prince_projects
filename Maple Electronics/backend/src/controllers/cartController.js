const Cart = require('../models/Cart');
const Product = require('../models/Product');

const calculateTotal = (items) =>
  items.reduce((total, item) => total + item.priceAtAdd * item.quantity, 0);

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      'items.productId',
      'name brand price images stock'
    );

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [], totalAmount: 0 });
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.status !== 'APPROVED') return res.status(400).json({ message: 'Product is not available' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [], totalAmount: 0 });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, priceAtAdd: product.price });
    }

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();
    await cart.populate('items.productId', 'name brand price images stock');

    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();
    await cart.populate('items.productId', 'name brand price images stock');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    cart.totalAmount = calculateTotal(cart.items);

    await cart.save();
    await cart.populate('items.productId', 'name brand price images stock');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
