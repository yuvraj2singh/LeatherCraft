const Project = require('../models/Project');

// GET /api/projects?category=Bags&page=1&limit=6
exports.getProjects = async (req, res) => {
  try {
    const { category, page = 1, limit = 6 } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const total  = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ projects, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects  (Admin only)
exports.createProject = async (req, res) => {
  try {
    const { title, category, material, status, imageUrl, notes } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const project = await Project.create({
      title, category, material, status, imageUrl, notes,
      createdBy: req.user.id
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/projects/:id  (Admin only)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/projects/:id  (Admin only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/projects/:id/status  (any authenticated user)
exports.patchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Completed', 'Archived', 'Commissioned', 'In Progress'];
    if (!status || !allowed.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
