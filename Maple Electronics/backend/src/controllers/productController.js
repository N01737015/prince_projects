const Product = require('../models/Product');
const User = require('../models/User');

const createProduct = async (req, res) => {
  try {
    if (req.user.role === 'VENDOR') {
      const vendor = await User.findOne({ keycloakId: req.user.id });
      if (vendor && vendor.vendorStatus !== 'APPROVED') {
        return res.status(403).json({ message: 'Your vendor account is pending admin approval' });
      }
    }

    const { name, brand, price, stock, categoryId, description, specs, images } = req.body;

    const product = await Product.create({
      vendorId: req.user.id,
      name,
      brand,
      price,
      stock,
      categoryId,
      description,
      specs: specs || {},
      images: images || [],
      status: 'PENDING'
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, search } = req.query;
    const filter = { status: 'APPROVED' };

    if (category) filter.categoryId = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (search) filter.name = new RegExp(search, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).populate('categoryId', 'name').sort('-createdAt');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('categoryId', 'name').sort('-createdAt');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.json([]);
    const recs = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
      status: 'APPROVED'
    })
      .limit(4)
      .populate('categoryId', 'name');
    res.json(recs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('categoryId', 'name');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('categoryId', 'name');

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id })
      .populate('categoryId', 'name')
      .sort('-createdAt');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getAdminProducts,
  getProductById,
  getRecommendations,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  getMyProducts
};
