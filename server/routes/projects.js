import express from 'express';
import Project from '../models/Project.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// GET single project (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// POST create project (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, techStack, liveUrl, repoUrl, thumbnail, featured } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required',
      });
    }

    const project = new Project({
      title,
      description,
      techStack,
      liveUrl,
      repoUrl,
      thumbnail,
      featured: featured || false,
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// PUT update project (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, techStack, liveUrl, repoUrl, thumbnail, featured } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        techStack,
        liveUrl,
        repoUrl,
        thumbnail,
        featured,
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// DELETE project (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
