 
// Task route definitions for task management and collaboration
// Provides core functionality for the task management system
const express = require('express');

const taskController = require('../controllers/taskController');


const auth = require('../middleware/auth');
const { requireTeamMemberOrAbove, requireProjectManager } = require('../middleware/rbac');

const router = express.Router();


// Apply auth to all routes
router.use(auth);

// Routes accessible to all authenticated team members and above
router.get('/my-tasks', requireTeamMemberOrAbove, taskController.getUserTasks);
router.get('/project/:projectId', requireTeamMemberOrAbove, taskController.getProjectTasks);
router.get('/:taskId', requireTeamMemberOrAbove, taskController.getTaskById);
router.patch('/:taskId/status', requireTeamMemberOrAbove, taskController.updateTaskStatus);
router.post('/:taskId/comments', requireTeamMemberOrAbove, taskController.addTaskComment);

// Routes requiring project manager or admin privileges
router.post('/', requireProjectManager, taskController.createTask);
router.put('/:id', requireProjectManager, taskController.updateTask);
router.post('/:taskId/assign', requireProjectManager, taskController.assignTask);

module.exports = router;