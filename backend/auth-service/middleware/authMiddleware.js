const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token from cookies
 */
const verifyToken = (req, res, next) => { 
  const token = req.cookies?.authToken; 
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

/**
 * Middleware to check Admin role
 */
const verifyAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized.' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  next();
};

module.exports = { verifyToken, verifyAdmin };