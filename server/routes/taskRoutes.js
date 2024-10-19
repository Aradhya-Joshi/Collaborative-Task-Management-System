const express = require('express');
const Task = require('../models/taskModel');
const router = express.Router();

// Create a new task
router.post('/create', async (req, res) => {
  try {
    const { title, description, project, assignedTo, dependencies } = req.body;
    const task = new Task({ title, description, project, assignedTo, dependencies });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tasks for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo dependencies');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task's status
router.put('/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { status } = req.body;
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;


module.exports = router;
