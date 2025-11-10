 
// Main application server file that initializes Express app with middleware and routes


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { seedPriorities, seedUsers, seedProjects, seedTasks, seedTaskAllocations } = require('./utils/seedData');
const { createAdminAccount } = require('./utils/createAdmin');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const notificationRoutes = require('./routes/notification');
const { default: mongoose } = require('mongoose');

const app = express();
const initializeDatabase = async () => {
    try {
        console.log('Initializing database...');
        await connectDB();
        console.log('Connected to database successfully');

        console.log('Dropping existing database for fresh start...');
        await mongoose.connection.dropDatabase();
        console.log('Database dropped successfully');

        console.log('Creating admin account...');
        await createAdminAccount();
        console.log('Admin account created successfully');

        console.log('Starting data seeding process...');
        await seedPriorities();
        await seedUsers();
        await seedProjects();
        await seedTasks();
        await seedTaskAllocations();
        console.log('All seeding completed successfully');

    } catch (error) {
        console.error('Database initialization failed:', error.message);
        process.exit(1);
    }
};

const setupMiddleware = (app) => {
    app.use(cors({
        origin: '*',
        credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // app.use((req, res, next) => {
    //     console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    //     console.log(`📨 ${new Date().toISOString()}`);
    //     console.log(`${req.method} ${req.url}`);
    //     console.log('Body:', req.body);
    //     console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    //     next();
    // });

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
};

const setupRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/notifications', notificationRoutes);
};

const setupHealthRoutes = (app) => {
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
            endpoints: {
                auth: '/api/auth',
                admin: '/api/admin',
                projects: '/api/projects',
                tasks: '/api/tasks',
                notifications: '/api/notifications',
                health: '/health'
            },
            roles: ['admin', 'project_manager', 'team_member']
        });
    });
};

const setupErrorHandlers = (app) => {
    app.use((req, res, next) => {
        res.status(404).json({
            message: 'Endpoint not found',
            path: req.originalUrl
        });
    });

    app.use(errorHandler);
};

const setupProcessHandlers = (server) => {
    process.on('unhandledRejection', (err) => {
        console.error('Unhandled Promise Rejection:', err);
        server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        server.close(() => process.exit(1));
    });
};

const startServer = () => {
    const PORT = 8800
    const server = app.listen(PORT, () => {
        console.log(`
    ========================================
     Server running in ${process.env.NODE_ENV || 'development'} mode
     URL: http://localhost:${PORT}
    ========================================
  `);
    });

    setupProcessHandlers(server);
    return server;
};

initializeDatabase();
setupMiddleware(app);
setupRoutes(app);
setupHealthRoutes(app);
setupErrorHandlers(app);
startServer();
