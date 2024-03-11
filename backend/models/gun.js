// models/gun.js
const mongoose = require('mongoose');

const gunSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

const Gun = mongoose.model('Gun', gunSchema);

module.exports = Gun;
