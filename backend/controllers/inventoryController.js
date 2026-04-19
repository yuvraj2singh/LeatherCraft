const Inventory = require('../models/Inventory');

exports.getItems = async (req, res) => {
  try {
    const items = await Inventory.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching inventory' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { itemName, category, stockQty, unit, costPerUnit, lowStockThreshold } = req.body;
    if (!itemName || !category || stockQty === undefined || !unit)
      return res.status(400).json({ message: 'itemName, category, stockQty and unit are required' });

    const item = await Inventory.create({ itemName, category, stockQty, unit, costPerUnit, lowStockThreshold });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating inventory item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // ✅  Use !== undefined so that 0 is a valid value
    if (req.body.stockQty   !== undefined) item.stockQty   = req.body.stockQty;
    if (req.body.costPerUnit !== undefined) item.costPerUnit = req.body.costPerUnit;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating inventory item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting inventory item' });
  }
};
