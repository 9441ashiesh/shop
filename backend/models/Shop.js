const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  buyPrice: Number,
  sellPrice: Number,
});

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  products: [productSchema], // Array of products embedded in shop
  // You can add more fields like address, owner, etc. if needed
});

module.exports = mongoose.model('Shop', shopSchema); 