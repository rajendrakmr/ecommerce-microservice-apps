const express = require("express");
const { v4: uuidv4 } = require("uuid"); // for unique IDs

const app = express();
app.use(express.json());

let cart = [];

// Get cart items
app.get("/cart", (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: `list of added cart`,
            item: cart,
            totalItems: cart?.length
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Server error" });
    }


});
// Add item to cart
app.post("/cart", (req, res) => {
    try {
        const { _id, name, price, quantity = 1 } = req.body;
        if (!_id || !name || !price) {
            return res.status(422).json({
                success: false,
                message: "productId, name, and price are required"
            });
        }

        // Check if the product is already in the cart
        const existingItem = cart.find(item => item._id === _id);

        if (existingItem) {
            // Update quantity
            existingItem.quantity = quantity;

            return res.status(200).json({
                success: true,
                message: `${name} quantity updated`,
                item: existingItem,
                totalItems: cart.length
            });
        }

        // If not exist, add new cart item
        const cartItem = {
            id: uuidv4(), // unique ID for the cart item
            _id,
            name,
            price,
            quantity
        };

        cart.push(cartItem);

        res.status(200).json({
            success: true,
            message: `${name} added to cart`,
            item: cartItem,
            totalItems: cart.length
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
});

// Remove item from cart
app.delete("/cart/:id", (req, res) => {
    const { id } = req.params;
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: "Item not found" });
    }
    const removed = cart.splice(index, 1)[0];
    res.json({ success: true, message: `${removed.name} removed`, totalItems: cart.length });
});

// Delete all items in cart
app.delete("/cart-remove", (req, res) => {
    const totalItems = cart.length;
    if (totalItems === 0) {
        return res.status(200).json({ success: true, message: "Cart is already empty", totalItems: 0 });
    }

    cart.length = 0; // clears the array
    res.status(200).json({ success: true, message: `All ${totalItems} items removed from cart`, totalItems: 0 });
});
app.listen(5004, () => {
    console.log("Cart Service running on port 5004");
});