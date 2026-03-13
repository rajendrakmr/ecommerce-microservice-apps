const router = require('express').Router();
const authController = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

// // Protected routes
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

// // Example of admin-only route
router.post('/admin-only', authController.adminAction);

module.exports = router;