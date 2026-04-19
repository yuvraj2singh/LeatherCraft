const Supplier = require('../models/Supplier');

// GET /api/suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/suppliers  (Admin only)
exports.createSupplier = async (req, res) => {
  try {
    const { name, initials, categories, email, website, notes } = req.body;
    if (!name) return res.status(400).json({ message: 'Supplier name is required' });
    const supplier = await Supplier.create({ name, initials, categories, email, website, notes });
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/suppliers/:id  (Admin only)
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/suppliers/:id  (Admin only)
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
