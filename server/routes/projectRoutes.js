const express = require('express');
const Project = require('../models/projectModel');
const router = express.Router();

// Create a new project
router.post('/create', async (req, res) => {
  try {
    const { name, description, users } = req.body;
    const project = new Project({ name, description, users });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('users');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
