const express = require("express");
const router = express.Router();
const CartItem = require("../../models/CartItem");

router.post("/add-to-cart", async (req, res) => {
  const { product, price, quantity } = req.body;
  const user = req.sessionID;

  try {
    const cartItem = new CartItem({ user, product, price, quantity });
    await cartItem.save();
    res.status(201).send("Item added to cart");
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/cart-items", async (req, res) => {
  const user = req.sessionID;

  try {
    const cartItems = await CartItem.find({ user });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
