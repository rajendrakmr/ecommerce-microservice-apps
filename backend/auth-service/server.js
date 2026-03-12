const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

// BASE ENDPOINT
app.get('/', (req, res) => {
  res.json({ message: 'Auth service API Running' });
});

app.listen(process.env.PORT, () => {
  console.log(`Auth Service running on port ${process.env.PORT}`);
});