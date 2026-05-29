const Product = require('../models/Product');
const User = require('../models/User');
require('../models/Category');

const createProduct = async (req, res) => {
  try {
    const { name, brand, price, stock, categoryId, description, specs, images } = req.body;

    if (!name || !brand || price === undefined || stock === undefined || !categoryId) {
      return res.status(400).json({
        message: 'name, brand, price, stock, and categoryId are required'
      });
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than zero' });
    }

    if (stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    if (req.user.role === 'VENDOR') {
      const vendor = await User.findOne({ keycloakId: req.user.id });

      if (!vendor) {
        return res.status(404).json({ message: 'Vendor account not found in database' });
      }

      if (vendor.vendorStatus !== 'APPROVED') {
        return res.status(403).json({
          message: 'Your vendor account is pending admin approval'
        });
      }

      const product = await Product.create({
        vendorId: vendor._id,
        categoryId,
        name,
        brand,
        price,
        stock,
        description,
        specs,
        images,
        status: 'PENDING'
      });

      return res.status(201).json(product);
    }

    if (req.user.role === 'ADMIN') {
      const vendorId = req.body.vendorId;

      if (!vendorId) {
        return res.status(400).json({ message: 'vendorId is required for admin product creation' });
      }

      const product = await Product.create({
        vendorId,
        categoryId,
        name,
        brand,
        price,
        stock,
        description,
        specs,
        images,
        status: req.body.status || 'APPROVED'
      });

      return res.status(201).json(product);
    }

    return res.status(403).json({ message: 'Only vendor or admin can create products' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice } = req.query;

    const filter = { status: 'APPROVED' };

    if (category) filter.categoryId = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate('vendorId', 'name email storeName')
      .populate('categoryId', 'name');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('vendorId', 'name email storeName')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendorId', 'name email storeName')
      .populate('categoryId', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const recommendations = await Product.find({
      _id: { $ne: product._id },
      categoryId: product.categoryId,
      status: 'APPROVED'
    })
      .populate('vendorId', 'name storeName')
      .populate('categoryId', 'name')
      .limit(4);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.user.role === 'VENDOR') {
      const vendor = await User.findOne({ keycloakId: req.user.id });
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor account not found' });
      }

      if (product.vendorId.toString() !== vendor._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this product' });
      }

      req.body.status = 'PENDING';
    } else if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Valid status required: PENDING, APPROVED, REJECTED' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (req.user.role === 'VENDOR') {
      const vendor = await User.findOne({ keycloakId: req.user.id });
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor account not found' });
      }

      if (product.vendorId.toString() !== vendor._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this product' });
      }
    } else if (req.user.role !== 'ADMIN') {
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
    const vendor = await User.findOne({ keycloakId: req.user.id });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor account not found' });
    }

    const products = await Product.find({ vendorId: vendor._id })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

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
