const axios = require('axios');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const params = new URLSearchParams();
    params.append('client_id', process.env.KEYCLOAK_CLIENT_ID);
    params.append('grant_type', 'password');
    params.append('username', email);
    params.append('password', password);

    const tokenResponse = await axios.post(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const tokenParts = tokenResponse.data.access_token.split('.');
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

    const roles = payload.realm_access?.roles || [];
    let role = 'CUSTOMER';
    if (roles.includes('admin')) role = 'ADMIN';
    else if (roles.includes('vendor')) role = 'VENDOR';

    const name = payload.name || payload.preferred_username || email;

    await User.findOneAndUpdate(
      { email: payload.email || email },
      { $set: { keycloakId: payload.sub, name, role } },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      access_token: tokenResponse.data.access_token,
      refresh_token: tokenResponse.data.refresh_token,
      expires_in: tokenResponse.data.expires_in,
      user: { email: payload.email || email, name, roles, role }
    });
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.error('Login error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Login failed' });
  }
};

const register = async (req, res) => {
  res.status(403).json({ message: 'Registration is managed through Keycloak. Contact admin.' });
};

const getMe = async (req, res) => {
  res.json({
    email: req.user.email,
    name: req.user.name,
    roles: req.user.roles,
    role: req.user.role
  });
};

module.exports = { register, login, getMe };
