const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const userRoutes = require("./routes/userRoutes")

const app = express()

mongoose.connect("mongodb+srv://rajen:Ckjdz6k9ylnU85Bc@cluster0.qnsjbe8.mongodb.net/?appName=Cluster0")

app.use(cors())
app.use(express.json())

app.use("/", userRoutes)

app.listen(5002, () => {
    console.log("User Service running")
})