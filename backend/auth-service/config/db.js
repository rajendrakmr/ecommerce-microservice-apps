const mongoose = require("mongoose")

const connectDB = async () => {
 await mongoose.connect("mongodb+srv://rajen:Ckjdz6k9ylnU85Bc@cluster0.qnsjbe8.mongodb.net/?appName=Cluster0")
 console.log("Auth DB Connected")
}

module.exports = connectDB