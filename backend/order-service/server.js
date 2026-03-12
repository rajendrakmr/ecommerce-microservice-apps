const express = require('express');
const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

const app = express();
app.use(express.json());

const generateOrderId = () => {
  const now = new Date();

  const year = now.getFullYear();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `ORD-${year}${day}${month}${hours}${minutes}${seconds}`;
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.post('/orders', async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    const orderId = generateOrderId();

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !total) {
      return res.status(422).json({
        success: false,
        message: 'userId, items array, and total are required'
      });
    }

    const newOrder = new Order({ userId, orderId, items, total });
    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

// Get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      success: true,
      message: 'List of all orders',
      orders,
      totalOrders: orders.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

// Get orders by userId
app.get('/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    res.status(200).json({
      success: true,
      message: `Orders for user ${userId}`,
      orders,
      totalOrders: orders.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Order Service running on port ${process.env.PORT}`);
});