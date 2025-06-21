const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

// Get products for a specific shop
router.get('/:shop', async (req, res) => {
  try {
    console.log('GET /products/:shop - shop name:', req.params.shop); // Debug log
    const shop = await Shop.findOne({ name: req.params.shop });
    console.log('GET /products/:shop - shop found:', shop); // Debug log
    if (!shop) {
      console.log('GET /products/:shop - shop not found'); // Debug log
      return res.status(404).json({ message: 'Shop not found' });
    }
    console.log('GET /products/:shop - products:', shop.products); // Debug log
    res.json(shop.products || []);
  } catch (error) {
    console.error('GET /products/:shop - error:', error); // Debug log
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product to a specific shop
router.post('/add', async (req, res) => {
  try {
    const { name, buyPrice, sellPrice, shop } = req.body;
    console.log('POST /products/add - request body:', req.body); // Debug log
    
    const shopDoc = await Shop.findOne({ name: shop });
    console.log('POST /products/add - shop found:', shopDoc); // Debug log
    if (!shopDoc) {
      console.log('POST /products/add - shop not found'); // Debug log
      return res.status(404).json({ message: 'Shop not found' });
    }

    const newProduct = { name, buyPrice, sellPrice };
    shopDoc.products.push(newProduct);
    await shopDoc.save();
    console.log('POST /products/add - product added successfully'); // Debug log
    
    res.json({ message: 'Product added' });
  } catch (error) {
    console.error('POST /products/add - error:', error); // Debug log
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product in a specific shop
router.put('/update/:id', async (req, res) => {
  try {
    const { name, buyPrice, sellPrice, shop } = req.body;
    
    const shopDoc = await Shop.findOne({ name: shop });
    if (!shopDoc) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const productIndex = shopDoc.products.findIndex(p => p._id.toString() === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    shopDoc.products[productIndex] = { name, buyPrice, sellPrice };
    await shopDoc.save();
    
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product from a specific shop
router.delete('/delete/:id', async (req, res) => {
  try {
    const { shop } = req.query; // Get shop from query parameter
    
    const shopDoc = await Shop.findOne({ name: shop });
    if (!shopDoc) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    shopDoc.products = shopDoc.products.filter(p => p._id.toString() !== req.params.id);
    await shopDoc.save();
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
