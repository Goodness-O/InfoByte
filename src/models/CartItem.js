const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  user: String,
  product: String,
  price: Number,
  quantity: Number,
});

module.exports = mongoose.model("CartItem", cartItemSchema);
