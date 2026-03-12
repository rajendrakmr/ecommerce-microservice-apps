const express = require("express")
const axios = require("axios")
const cors = require("cors")
require("dotenv").config()
const app = express()

app.use(cors())
app.use(express.json())

const handleRequest = (fn) => async (req, res) => {
    try {
        const response = await fn(req);
        res.json(response.data);
    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json(err.response.data);
        }
        res.status(500).json({ message: "Server error" });
    }
};
/** Auth service url end point */

const authService = axios.create({ baseURL: process.env.AUTH_SERVICE_URL }); 
app.post("/auth/register", handleRequest((req) => authService.post("/register", req.body)));
app.post("/auth/login", handleRequest((req) => authService.post("/login", req.body)));

/** User service url end point */

const userService = axios.create({ baseURL: process.env.USER_SERVICE_URL })
app.post("/users", handleRequest((req) => userService.post("/users", req.body)));
 

/** User Products url end point */

const productService = axios.create({ baseURL: process.env.PRODUCT_SERVICE_URL })

app.post("/products", handleRequest((req) => productService.post("/products", req.body)));
app.get("/products", handleRequest((req) => productService.get("/products", req.body)));


const cartService = axios.create({ baseURL: process.env.CART_SERVICE_URL })

app.post("/cart", handleRequest((req) => cartService.post("/cart", req.body)));
app.get("/cart", handleRequest((req) => cartService.get("/cart", req.body)));
app.delete("/cart-remove", handleRequest((req) => cartService.delete("/cart-remove", req.body)));


const orderService = axios.create({ baseURL: process.env.ORDER_SERVICE_URL })

app.post("/orders", handleRequest((req) => orderService.post("/orders", req.body)));
app.get("/orders", handleRequest((req) => orderService.get("/orders", req.body)));
  
// BASE ENDPOINT
app.get("/", (req, res) => {
    res.json({ message: "API Gateway Running" })
})

app.listen(process.env.PORT, () => {
    console.log(`API Gateway running on port ${process.env.PORT}`)
})