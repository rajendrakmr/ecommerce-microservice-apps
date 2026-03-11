const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

/** Auth service url end point */
const authService = axios.create({ baseURL: "http://localhost:5001/auth" })
app.post("/auth/register", async (req, res) => {
    try {
        const response = await authService.post("/register", req.body)
        res.json(response.data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post("/auth/login", async (req, res) => {
    try {
        const response = await authService.post("/login", req.body)
        res.json(response.data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})
/** End Auth service url end point */


/** User service url end point */
const userService = axios.create({ baseURL: "http://localhost:5002/" })
app.get("/users", async (req, res) => {
    try {
        const response = await userService.get("/users", req.body)
        res.json(response.data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


/** END User service url end point */



/** User Products url end point */
const userProducts = axios.create({ baseURL: "http://localhost:5003/" })
app.get("/products", async (req, res) => {
    try {
        const response = await userProducts.get("/products", req.body)
        res.json(response.data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post("/products", async (req, res) => {
    try {
        const response = await userProducts.post("/products", req.body)
        res.json(response.data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


/** END User service url end point */



 
// BASE ENDPOINT
app.get("/", (req, res) => {
    res.json({ message: "API Gateway Running" })
})

app.listen(5000, () => {
    console.log("API Gateway running on port 5000")
})