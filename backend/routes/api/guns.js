// routes/api/guns.js
const express = require('express');
const router = express.Router();
const Gun = require('../../models/gun');

// Define a route to add a gun
router.post('/add', async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const newGun = new Gun({ name, price, image });
    const savedGun = await newGun.save();
    res.json(savedGun);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
