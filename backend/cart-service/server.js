const express = require("express")

const app = express()

app.use(express.json())

let cart=[]

app.get("/cart",(req,res)=>{
 res.json(cart)
})

app.post("/cart",(req,res)=>{
 cart.push(req.body)
 res.json(cart)
})

app.listen(5004,()=>{
 console.log("Cart Service running")
})