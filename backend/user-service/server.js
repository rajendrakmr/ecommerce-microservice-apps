const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const userRoutes = require("./routes/userRoutes")
require("dotenv").config();

const app = express()

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors())
app.use(express.json())

app.use("/", userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`User Service running ${process.env.PORT}`)
})