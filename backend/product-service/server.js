const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config();

const productRoutes = require("./routes/productRoutes")

const app = express()


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors())
app.use(express.json())

app.use("/", productRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Product Service running ${process.env.PORT}`)
})