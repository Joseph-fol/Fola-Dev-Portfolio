import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Load environment variables
dotenv.config();

// Configure DNS for better SRV resolution
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Import routes
import projectRoutes from './routes/projects.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import skillsRoutes from './routes/skills.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with fallback
const connectDB = async () => {
  const mongoOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true,
  };

  try {
    // Try Atlas connection first
    await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
    console.log('✓ MongoDB connected successfully to Atlas');
  } catch (err) {
    console.warn('⚠ Atlas connection failed:', err.message);
    console.log('↻ Attempting fallback to local MongoDB...');
    try {
      await mongoose.connect('mongodb://localhost:27017/portfolio', mongoOptions);
      console.log('✓ Connected to local MongoDB successfully');
    } catch (fallbackErr) {
      console.error('✗ MongoDB connection failed (both Atlas and local):', fallbackErr.message);
      console.error('  → Start MongoDB locally: mongod');
      console.error('  → Or verify MONGODB_URI in .env is valid');
      process.exit(1);
    }
  }
};

connectDB();

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/skills', skillsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
