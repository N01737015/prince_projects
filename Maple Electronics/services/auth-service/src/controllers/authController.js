const User = require('../models/User');
const { getTokenWithPassword } = require('../services/keycloakService');

const decodeJwtPayload = (token) => {
  const tokenParts = token.split('.');
  return JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
};

const mapRoleFromToken = (roles) => {
  if (roles.includes('admin')) return 'ADMIN';
  if (roles.includes('vendor')) return 'VENDOR';
  return 'CUSTOMER';
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const tokenData = await getTokenWithPassword(email, password);
    const payload = decodeJwtPayload(tokenData.access_token);

    const roles = payload.realm_access?.roles || [];
    const role = mapRoleFromToken(roles);

    let existingUser = await User.findOne({ keycloakId: payload.sub });

    if (!existingUser) {
      existingUser = await User.create({
        keycloakId: payload.sub,
        name: payload.name || '',
        email: payload.email || email,
        role,
        vendorStatus: role === 'VENDOR' ? 'PENDING' : 'APPROVED',
        storeName: ''
      });
    } else {
      existingUser.name = payload.name || existingUser.name;
      existingUser.email = payload.email || existingUser.email;
      existingUser.role = role;
      await existingUser.save();
    }

    res.json({
      success: true,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      user: {
        id: existingUser.keycloakId,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        vendorStatus: existingUser.vendorStatus,
        storeName: existingUser.storeName,
        roles
      }
    });
  } catch (error) {
    const status = error.response?.status || 500;

    if (status === 400 || status === 401) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(500).json({
      message: 'Authentication failed',
      details: error.response?.data || error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ keycloakId: req.user.id });

    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    res.json({
      id: user.keycloakId,
      email: user.email,
      name: user.name,
      role: user.role,
      vendorStatus: user.vendorStatus,
      storeName: user.storeName,
      roles: req.user.roles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'VENDOR' }).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveVendor = async (req, res) => {
  try {
    const { vendorStatus, storeName } = req.body;

    const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (vendorStatus && !allowedStatuses.includes(vendorStatus)) {
      return res.status(400).json({ message: 'Invalid vendor status' });
    }

    const vendor = await User.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    if (vendor.role !== 'VENDOR') {
      return res.status(400).json({ message: 'Selected user is not a vendor' });
    }

    if (vendorStatus) vendor.vendorStatus = vendorStatus;
    if (storeName !== undefined) vendor.storeName = storeName;

    await vendor.save();

    res.json({
      message: 'Vendor updated successfully',
      vendor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  getMe,
  getVendors,
  approveVendor
};