const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * REGISTER
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const errors = {};
    if (!name || name.trim() === '') errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (Object.keys(errors).length > 0) return res.status(422).json({ errors });

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(422).json({ errors: { email: 'Email already exists' } });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(422).json({ errors: { email: 'User not found' } });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(422).json({ errors: { password: 'Invalid password' } });

    const accessToken = jwt.sign({ id: user._id, email: user.email, role: user.role || 'user' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id, email: user.email, role: user.role || 'user' }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('authToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', maxAge: 7 * 24 * 60 * 60 * 1000 });

    const userObj = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    };

    res.json({
      message: 'Login successful',
      user: userObj,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * LOGOUT
 */
exports.logout = async (req, res) => {
  res.clearCookie('authToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

/**
 * GET CURRENT USER
 */
exports.getMe = async (req, res) => {
  try { 
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(422).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.log('err', err)
    res.status(500).json({ message: 'Server error!' });
  }
};

/**
 * REFRESH TOKEN
 */
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('authToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', maxAge: 15 * 60 * 1000 });

    res.json({ message: 'Access token refreshed successfully' });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};


exports.adminAction = async (req, res) => {
  try {
    const adminId = req.user.id;
    res.json({
      message: 'Admin action performed successfully',
      adminId: adminId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};