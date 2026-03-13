const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

connectDB();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.headers['x-user-id']) {
    req.user = {
      id: req.headers['x-user-id'],
      // role: req.headers['x-user-role'],
      email: req.headers['x-user-email']
    };
  }
  next();
});
app.use('/auth', authRoutes);

// BASE ENDPOINT
app.get('/', (req, res) => {
  res.json({ message: 'Auth service API Running' });
});

app.listen(process.env.PORT, () => {
  console.log(`Auth Service running on port ${process.env.PORT}`);
});