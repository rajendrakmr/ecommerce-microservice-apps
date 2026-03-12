const router = require("express").Router();
const Product = require("../models/Product");

// GET all products
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// CREATE a new product
router.post("/products", async (req, res) => {
    try {
        const { name, price, category, rating, reviews, stock } = req.body;
        const errors = {};
        if (!name) errors.name = "Name is required";
        if (!price) errors.price = "Price is required";
        if (!category) errors.category = "Category is required";

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ errors });
        }

        const product = new Product({
            name,
            price,
            category,
            rating: rating || 0,
            reviews: reviews || 0,
            stock: stock || 0
        });
        await product.save();
        res.status(200).json({ message: "Product created successfully", product });
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;