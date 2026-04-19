const express = require('express');
const router = express.Router();
const { getItems, createItem, updateItem, deleteItem } = require('../controllers/inventoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

// GET — any logged-in user can view inventory
// POST — Admin only (create items)
router.route('/')
  .get(protect, getItems)
  .post(protect, admin, createItem);

// PUT / DELETE — Admin only
router.route('/:id')
  .put(protect, admin, updateItem)
  .delete(protect, admin, deleteItem);

module.exports = router;
