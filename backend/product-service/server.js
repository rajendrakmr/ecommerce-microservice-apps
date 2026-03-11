const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const productRoutes = require("./routes/productRoutes")

const app = express()

mongoose.connect("mongodb+srv://rajen:Ckjdz6k9ylnU85Bc@cluster0.qnsjbe8.mongodb.net/?appName=Cluster0")

app.use(cors())
app.use(express.json())

app.use("/",productRoutes)

app.listen(5003,()=>{
 console.log("Product Service running")
})