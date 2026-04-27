import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from './prisma.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Centralized prisma client used

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', usersRoutes);

app.get('/test', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json({ message: "Connection works!", users });
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});