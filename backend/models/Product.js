const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  buyPrice: Number,
  sellPrice: Number,
  shop: String,
});

module.exports = mongoose.model('Product', productSchema);
