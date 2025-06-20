const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // You can add more fields like address, owner, etc. if needed
});

module.exports = mongoose.model('Shop', shopSchema); 