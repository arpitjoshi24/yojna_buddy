import express from 'express';
import { Project } from '../models/Project.js';

const router = express.Router();

// Get all projects for a user
router.get('/:userId', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project', error });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error updating project', error });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting project', error });
  }
});

export const projectRouter = router;