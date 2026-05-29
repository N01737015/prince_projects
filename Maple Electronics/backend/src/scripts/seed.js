const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../../.env') });

const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

const VENDOR_KEYCLOAK_ID = 'b0000002-0000-0000-0000-000000000000';

const categories = [
  { name: 'Laptops', description: 'Portable computers and notebooks' },
  { name: 'Smartphones', description: 'Mobile phones and accessories' },
  { name: 'Cameras', description: 'Digital cameras and photography gear' },
  { name: 'Audio', description: 'Headphones, speakers and audio equipment' },
  { name: 'Tablets', description: 'Tablets and e-readers' },
  { name: 'Gaming', description: 'Gaming consoles, accessories and peripherals' }
];

const buildProducts = (catMap, vendorId) => [
  {
    vendorId,
    categoryId: catMap['Laptops'],
    name: 'ProBook X15 Laptop',
    brand: 'Dell',
    price: 1299.99,
    stock: 25,
    status: 'APPROVED',
    description: '15.6" FHD display, Intel Core i7, 16GB RAM, 512GB SSD',
    specs: { Processor: 'Intel Core i7-13700H', RAM: '16GB DDR5', Storage: '512GB NVMe SSD', Display: '15.6" FHD 144Hz', OS: 'Windows 11' },
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Laptops'],
    name: 'UltraSlim Pro 13',
    brand: 'Apple',
    price: 1599.00,
    stock: 18,
    status: 'APPROVED',
    description: 'M3 chip, 13" Retina display, 8GB unified memory, 256GB SSD',
    specs: { Processor: 'Apple M3', RAM: '8GB Unified', Storage: '256GB SSD', Display: '13.3" Retina', Battery: '18 hours' },
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Smartphones'],
    name: 'Galaxy S25 Ultra',
    brand: 'Samsung',
    price: 1199.99,
    stock: 40,
    status: 'APPROVED',
    description: '6.8" Dynamic AMOLED, 200MP camera, 5000mAh battery',
    specs: { Display: '6.8" Dynamic AMOLED 2X', Camera: '200MP + 12MP + 10MP + 10MP', Battery: '5000mAh', Storage: '256GB', RAM: '12GB' },
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Smartphones'],
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    price: 1099.00,
    stock: 35,
    status: 'APPROVED',
    description: '6.1" Super Retina XDR, A18 Pro chip, 48MP camera system',
    specs: { Display: '6.1" Super Retina XDR', Chip: 'A18 Pro', Camera: '48MP Main + 12MP Ultra Wide', Storage: '128GB', MagSafe: 'Yes' },
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Cameras'],
    name: 'EOS R50 Mirrorless',
    brand: 'Canon',
    price: 799.99,
    stock: 15,
    status: 'APPROVED',
    description: '24.2MP APS-C CMOS sensor, 4K video, Wi-Fi + Bluetooth',
    specs: { Sensor: '24.2MP APS-C CMOS', Video: '4K 30fps', ISO: '100-32000', AF: 'Dual Pixel CMOS AF II', Weight: '375g' },
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Cameras'],
    name: 'Alpha A7 IV',
    brand: 'Sony',
    price: 2499.99,
    stock: 8,
    status: 'APPROVED',
    description: '33MP full-frame BSI CMOS, 10fps burst, 4K 60fps video',
    specs: { Sensor: '33MP Full-Frame BSI CMOS', Video: '4K 60fps', ISO: '100-51200', AF: '759-point phase-detect', Weather: 'Sealed' },
    images: ['https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Audio'],
    name: 'QuietComfort 45 Headphones',
    brand: 'Bose',
    price: 329.99,
    stock: 50,
    status: 'APPROVED',
    description: 'World-class noise cancelling, 24-hour battery life, Bluetooth 5.1',
    specs: { Type: 'Over-ear', ANC: 'Active Noise Cancellation', Battery: '24 hours', Connectivity: 'Bluetooth 5.1', Weight: '238g' },
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Audio'],
    name: 'WH-1000XM5 Headphones',
    brand: 'Sony',
    price: 399.99,
    stock: 30,
    status: 'APPROVED',
    description: 'Industry-leading noise cancellation, 30-hour battery, multipoint connection',
    specs: { Type: 'Over-ear', ANC: 'V1 Processor + QN1', Battery: '30 hours', Connectivity: 'Bluetooth 5.2', Codec: 'LDAC, AAC, SBC' },
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Tablets'],
    name: 'iPad Air 5th Gen',
    brand: 'Apple',
    price: 749.00,
    stock: 22,
    status: 'APPROVED',
    description: '10.9" Liquid Retina display, M1 chip, 64GB, Wi-Fi + USB-C',
    specs: { Chip: 'Apple M1', Display: '10.9" Liquid Retina', Storage: '64GB', Camera: '12MP Ultra Wide front', Connectivity: 'Wi-Fi 6, USB-C' },
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Tablets'],
    name: 'Galaxy Tab S9',
    brand: 'Samsung',
    price: 799.99,
    stock: 20,
    status: 'APPROVED',
    description: '11" Dynamic AMOLED 2X, Snapdragon 8 Gen 2, 128GB, IP68',
    specs: { Display: '11" Dynamic AMOLED 2X 120Hz', Processor: 'Snapdragon 8 Gen 2', RAM: '8GB', Storage: '128GB', Rating: 'IP68' },
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Gaming'],
    name: 'DualSense Wireless Controller',
    brand: 'PlayStation',
    price: 69.99,
    stock: 75,
    status: 'APPROVED',
    description: 'Haptic feedback, adaptive triggers, built-in microphone, USB-C charging',
    specs: { Connectivity: 'Bluetooth 5.1 + USB-C', Battery: '12 hours', Compatibility: 'PS5, PC', Features: 'Haptic feedback, Adaptive triggers', Weight: '280g' },
    images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80']
  },
  {
    vendorId,
    categoryId: catMap['Gaming'],
    name: 'Xbox Wireless Controller',
    brand: 'Microsoft',
    price: 59.99,
    stock: 60,
    status: 'APPROVED',
    description: 'Textured grip, Share button, Xbox Wireless + Bluetooth, 40hr battery',
    specs: { Connectivity: 'Xbox Wireless + Bluetooth', Battery: '40 hours (AA)', Compatibility: 'Xbox Series X|S, Xbox One, PC, Mobile', USB: 'USB-C', Weight: '287g' },
    images: ['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({ keycloakId: VENDOR_KEYCLOAK_ID })
    ]);
    console.log('Cleared existing seed data');

    const createdCats = await Category.insertMany(categories);
    const catMap = {};
    createdCats.forEach((c) => { catMap[c.name] = c._id; });
    console.log('Created ' + createdCats.length + ' categories');

    await User.create({
      keycloakId: VENDOR_KEYCLOAK_ID,
      email: 'vendor1@example.com',
      name: 'Vendor One',
      role: 'VENDOR',
      vendorStatus: 'APPROVED',
      storeName: 'Maple Electronics Store'
    });
    console.log('Created vendor user');

    const products = buildProducts(catMap, VENDOR_KEYCLOAK_ID);
    await Product.insertMany(products);
    console.log('Created ' + products.length + ' products');

    console.log('Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
