import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
const prisma = new PrismaClient();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// Sync user with database after Supabase authentication
router.post('/sync', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // Find or create user in DB
        let dbUser = await prisma.user.findUnique({
            where: { email: user.email }
        });
        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || null,
                }
            });
        }
        res.json({
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role
        });
    }
    catch (err) {
        console.error('Auth sync error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get current user info (requires authentication)
router.get('/me', authenticateToken, (req, res) => {
    res.json(req.user);
});
// Logout (client-side handles this, but we can have a server endpoint)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});
export default router;
//# sourceMappingURL=authRoutes.js.map