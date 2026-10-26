const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const mockStore = require('../config/mockStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026'
      );

      if (getIsConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const u = mockStore.users.find((user) => user._id === decoded.id);
        if (u) {
          const { password, ...safeUser } = u;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found for this token' });
      }
      return next();
    } catch (error) {
      console.error('[Auth Middleware] Token error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin role required' });
  }
};

module.exports = { protect, admin };
