const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  initials:   { type: String, trim: true },          // e.g. "HC" — auto-computed if blank
  categories: [{ type: String }],                    // ['Hides','Hardware',…]
  email:      { type: String, default: '' },
  website:    { type: String, default: '' },
  notes:      { type: String, default: '' }
}, { timestamps: true });

// Auto-generate initials before saving if not provided
SupplierSchema.pre('save', async function () {
  if (!this.initials) {
    this.initials = this.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
});

module.exports = mongoose.model('Supplier', SupplierSchema);
