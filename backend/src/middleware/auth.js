import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const prisma = new PrismaClient();
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;
        if (!token) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }
        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }
        // Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email }
        });
        if (!dbUser) {
            res.status(401).json({ error: 'User not found in database' });
            return;
        }
        // Attach user to request
        req.user = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
//# sourceMappingURL=auth.js.map