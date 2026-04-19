const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  category: { type: String, enum: ['Bags', 'Wallets', 'Folios', 'Belts', 'Other'], default: 'Other' },
  material: { type: String, default: '' },
  status:   { type: String, enum: ['Completed', 'Archived', 'Commissioned', 'In Progress'], default: 'Completed' },
  imageUrl: { type: String, default: '' },
  notes:    { type: String, default: '' },
  createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
