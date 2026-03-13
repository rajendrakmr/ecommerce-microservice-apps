const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // frontend origin
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ---------------------
// Helper: Extract tokens from Set-Cookie and set in gateway
// ---------------------
const setAuthCookies = (res, setCookieArray) => {
  if (!setCookieArray) return;

  const authTokenStr = setCookieArray.find(c => c.startsWith('authToken='));
  const refreshTokenStr = setCookieArray.find(c => c.startsWith('refreshToken='));

  const authToken = authTokenStr?.split(';')[0].split('=')[1];
  const refreshToken = refreshTokenStr?.split(';')[0].split('=')[1];

  if (authToken) res.cookie('authToken', authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 15 * 60 * 1000 // 15 min
  });

  if (refreshToken) res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// ---------------------
// Middleware: Verify auth token
// ---------------------
const verifyToken = (req, res, next) => {
  const token = req.cookies?.authToken;
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.headers['x-user-id'] = decoded.id;
    // req.headers['x-user-role'] = decoded.role;
    req.headers['x-user-email'] = decoded.email; // optional
    next();
  } catch (err) {
    console.log('errerrerrerr', err)
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// ---------------------
// Helper: Handle requests to microservices
// ---------------------
const handleRequest = (fn) => async (req, res) => {
  try {
    const response = await fn(req);

    // Set cookies if Auth Service returns them
    if (response.headers['set-cookie']) {
      setAuthCookies(res, response.headers['set-cookie']);
    }

    res.json(response.data);
  } catch (err) {
    if (err.response) return res.status(err.response.status).json(err.response.data);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------
// Axios instances
// ---------------------
const authService = axios.create({ baseURL: process.env.AUTH_SERVICE_URL, withCredentials: true });
const userService = axios.create({ baseURL: process.env.USER_SERVICE_URL });
const productService = axios.create({ baseURL: process.env.PRODUCT_SERVICE_URL });
const cartService = axios.create({ baseURL: process.env.CART_SERVICE_URL });
const orderService = axios.create({ baseURL: process.env.ORDER_SERVICE_URL });

// ---------------------
// Auth routes
// ---------------------
app.post('/auth/register', handleRequest(req => authService.post('/register', req.body)));
app.post('/auth/login', handleRequest(req => authService.post('/login', req.body, { withCredentials: true })));
app.post('/auth/refresh', handleRequest(req => authService.post('/refresh', req.body, { withCredentials: true })));
// app.post('/auth/logout', handleRequest(req => authService.post('/logout', {}, { withCredentials: true })));
app.get('/auth/me', verifyToken, handleRequest(req => authService.get('/me', { headers: { 'x-user-id': req.user.id } })));
// api-gateway/src/index.js

app.post('/auth/logout', async (req, res) => {
  try {
    // Call Auth Service logout (optional, if you implement blacklist)
    await axios.post(`${process.env.AUTH_SERVICE_URL}/logout`, {}, {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie || ''
      }
    });

    // Clear cookies on the client
    res.cookie('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 0, // expire immediately
    });

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 0, // expire immediately
    });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// ---------------------
// User routes
// ---------------------
app.get('/users/me', verifyToken, handleRequest(req => userService.get('/users/me', { headers: req.headers })));

// ---------------------
// Product routes
// ---------------------
app.get('/products', handleRequest(() => productService.get('/products')));
app.post('/products', verifyToken, handleRequest(req => productService.post('/products', req.body, { headers: req.headers })));

// ---------------------
// Cart routes
// ---------------------
app.get('/cart', verifyToken, handleRequest(req => cartService.get('/cart', { headers: req.headers })));
app.post('/cart', verifyToken, handleRequest(req => cartService.post('/cart', req.body, { headers: req.headers })));

// ---------------------
// Order routes
// ---------------------
app.get('/orders', verifyToken, handleRequest(req => orderService.get('/orders', { headers: req.headers })));
app.post('/orders', verifyToken, handleRequest(req => orderService.post('/orders', req.body, { headers: req.headers })));

// ---------------------
// Base endpoint
// ---------------------
app.get('/', (req, res) => res.json({ message: 'API Gateway Running' }));

// ---------------------
// Start server
// ---------------------
app.listen(process.env.PORT, () => console.log(`API Gateway running on port ${process.env.PORT}`));