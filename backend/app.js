require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const notificationRoutes = require('./routes/notification');

const app = express();

// Initialize database connection only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware setup
app.use(cors({
  origin: "https://sarina-taskpilot.netlify.app", // only allow your frontend
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true, // allow cookies if you use them
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes); // Using projects instead of teams
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Task Management API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Management API',
    version: '1.0.0',
    status: 'running'
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
