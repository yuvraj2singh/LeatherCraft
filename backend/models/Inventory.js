const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, enum: ['Leather', 'Hides', 'Threads', 'Hardware', 'Accessories'], required: true },
  stockQty: { type: Number, required: true },
  unit: { type: String, required: true }, // e.g., 'sq.ft', 'Spools', 'pcs'
  costPerUnit: { type: Number, required: true },
  lowStockThreshold: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
