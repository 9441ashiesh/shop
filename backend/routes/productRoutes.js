const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add product
router.post('/add', async (req, res) => {
  const { name, buyPrice, sellPrice } = req.body;
  const newProduct = new Product({ name, buyPrice, sellPrice });
  await newProduct.save();
  res.json({ message: 'Product added' });
});

// Update product
router.put('/update/:id', async (req, res) => {
  const { name, buyPrice, sellPrice } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, buyPrice, sellPrice });
  res.json({ message: 'Product updated' });
});

// Delete product
router.delete('/delete/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
