import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Middleware to require authentication on all user routes
router.use(authenticateToken);

// ─── GET /api/users ───────────────────────────────────────────────────────
// Admin only - list all users (for assign dropdown)
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    // Only admins can list users
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can list users' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      },
      orderBy: { email: 'asc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
