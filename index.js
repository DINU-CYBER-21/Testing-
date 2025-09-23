const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');

const restrt = require('./ecosystem.config');
const config = require('./config');
const { connectDatabase } = require('./database/connection');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const botRoutes = require('./routes/bot');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Global middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO for real-time updates
global.io = io;

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Serve main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error(chalk.red('Server Error:'), error);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(chalk.blue('Client connected:'), socket.id);
    socket.on('disconnect', () => {
        console.log(chalk.yellow('Client disconnected:'), socket.id);
    });
});

// ------------------- Bot Session Restore & Auto-Save -------------------
const SESSION_FILE = path.join(__dirname, 'sessions.json');
global.botSession = {};

// Load session at startup
const loadSession = async () => {
    try {
        if (await fs.pathExists(SESSION_FILE)) {
            global.botSession = await fs.readJson(SESSION_FILE);
            console.log(chalk.green('✅ Bot session restored from file.'));
        } else {
            console.log(chalk.yellow('⚠️ No previous session found, starting fresh.'));
        }
    } catch (err) {
        console.error(chalk.red('❌ Failed to load session:'), err);
    }
};

// Save session periodically
const saveSession = async () => {
    try {
        await fs.writeJson(SESSION_FILE, global.botSession);
        console.log(chalk.blue('💾 Bot session saved.'));
    } catch (err) {
        console.error(chalk.red('❌ Failed to save session:'), err);
    }
};

// Auto-save every 5 minutes
setInterval(saveSession, 5 * 60 * 1000);

// ------------------- Start server -------------------
const startServer = async () => {
    try {
        // Connect to database
        await connectDatabase();

        // Load previous bot session
        await loadSession();

        // Start server
        const PORT = config.PORT;
        server.listen(PORT, () => {
            console.log(chalk.green(`
╔══════════════════════════════════════════════════════════════╗
║                        QUEEN-MINI v${config.APP_VERSION}                        ║
║                  Advanced WhatsApp Bot System                 ║
║                                                              ║
║  🚀 Server running on: http://localhost:${PORT}                ║
║  📊 Database: Connected                                      ║
║  🔒 Security: Enabled                                        ║
║  ⚡ Real-time: Socket.IO Active                             ║
║                                                              ║
║  Copyright © ${config.COPYRIGHT.YEAR} ${config.COPYRIGHT.COMPANY}                    ║
║  Owner: ${config.COPYRIGHT.OWNER}                                      ║
║  GitHub: ${config.COPYRIGHT.GITHUB}                ║
╚══════════════════════════════════════════════════════════════╝
            `));
        });
    } catch (error) {
        console.error(chalk.red('Failed to start server:'), error);
        process.exit(1);
    }
};

// Graceful shutdown + save session
const gracefulShutdown = async (signal) => {
    console.log(chalk.yellow(`${signal} received, saving session and shutting down gracefully...`));
    await saveSession();
    server.close(() => {
        console.log(chalk.green('Server closed'));
        process.exit(0);
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ------------------- PM2 Auto Restart -------------------
// 50 minutes interval auto-restart handled via PM2 cron_restart in ecosystem.config.js
// (No code change needed here; session restore ensures bot reconnects automatically)

startServer();

module.exports = app;
