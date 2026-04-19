const express = require('express');
const router  = express.Router();
const {
  getProjects, createProject, updateProject, deleteProject, patchStatus
} = require('../controllers/projectController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/',              protect,        getProjects);
router.post('/',             protect, admin, createProject);
router.put('/:id',           protect, admin, updateProject);
router.delete('/:id',        protect, admin, deleteProject);
router.patch('/:id/status',  protect,        patchStatus);   // all authenticated users

module.exports = router;
