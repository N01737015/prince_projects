const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, key.getPublicKey());
  });
};

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ['RS256'],
      issuer: process.env.JWT_ISSUER
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const roles = decoded.realm_access?.roles || [];

      let role = 'CUSTOMER';
      if (roles.includes('admin')) role = 'ADMIN';
      else if (roles.includes('vendor')) role = 'VENDOR';
      else if (roles.includes('customer')) role = 'CUSTOMER';

      req.user = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        roles,
        role
      };

      next();
    }
  );
};

module.exports = { protect };