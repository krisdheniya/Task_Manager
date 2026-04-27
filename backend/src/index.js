import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import authRoutes from './routes/authRoutes.js';
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// Routes
app.use('/api/auth', authRoutes);
app.get('/test', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json({ message: "Connection works!", users });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to connect to database" });
    }
});
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
//# sourceMappingURL=index.js.map