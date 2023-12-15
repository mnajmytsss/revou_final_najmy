const jwt = require('jsonwebtoken');
const { JWT_SIGN } = require('../config/index');

const authorizationMiddleware = (allowedRoles) => (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'tidak memiliki akses otorisasi' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SIGN);
    // console.log(decodedToken.role);

    // Check if the decoded token's role is included in the allowed roles
    if (allowedRoles.includes(decodedToken.role)) {
      next();
    } else {
      return res.status(403).json({ error: 'Akses ditolak!' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const authorizationMiddlewareForRole1 = authorizationMiddleware("1");
const authorizationMiddlewareForRole2 = authorizationMiddleware("2");
const authorizationMiddlewareForRole3 = authorizationMiddleware("3");

module.exports = {
  authorizationMiddlewareForRole1,
  authorizationMiddlewareForRole2,
  authorizationMiddlewareForRole3
};
