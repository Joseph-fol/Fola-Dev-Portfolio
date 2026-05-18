import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// POST contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address',
      });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters long',
      });
    }

    // Create message document
    const newMessage = new Message({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
    });

    // Save to database
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: newMessage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to send message',
    });
  }
});

// GET all messages (protected - would need auth middleware in production)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
