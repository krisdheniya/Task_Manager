import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Middleware to require authentication on all task routes
router.use(authenticateToken);

// ─── GET /api/tasks ───────────────────────────────────────────────────────
// ADMIN gets all tasks, USER gets only their own
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const where = req.user?.role === 'ADMIN' ? {} : { createdById: req.user?.id };

    const tasks = await prisma.task.findMany({
      where,
      include: {
        createdBy: { select: { id: true, email: true, name: true } },
        assignedTo: { select: { id: true, email: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ─── POST /api/tasks ──────────────────────────────────────────────────────
// Create task (userId always set to current user if USER role)
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { title, description, assigneeId } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' });
    }

    const task = await prisma.task.create({
      data: {
        title: title as string,
        description: (description && typeof description === 'string') ? description : null,
        createdById: req.user!.id,
        assigneeId: (assigneeId && typeof assigneeId === 'string') ? assigneeId : req.user!.id
      },
      include: {
        createdBy: { select: { id: true, email: true, name: true } },
        assignedTo: { select: { id: true, email: true, name: true } }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────
// Get single task with assignee info
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id as string },
      include: {
        createdBy: { select: { id: true, email: true, name: true } },
        assignedTo: { select: { id: true, email: true, name: true } }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Users can only see their own tasks, admins see all
    if (req.user?.role !== 'ADMIN' && task.createdById !== req.user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// ─── PATCH /api/tasks/:id ─────────────────────────────────────────────────
// Edit title, description, status
router.patch('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const { title, description, status } = req.body;

    // Get task to verify ownership
    const task = await prisma.task.findUnique({
      where: { id: req.params.id as string }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // User can only edit their own tasks, admin can edit all
    if (req.user?.role !== 'ADMIN' && task.createdById !== req.user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id as string },
      data: {
        ...(title && typeof title === 'string' && { title }),
        ...(description !== undefined && typeof description === 'string' && { description }),
        ...(status && typeof status === 'string' && { status: status as any })
      },
      include: {
        createdBy: { select: { id: true, email: true, name: true } },
        assignedTo: { select: { id: true, email: true, name: true } }
      }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────
// Delete task (ownership check, admin can delete any)
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id as string }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // User can only delete their own tasks, admin can delete all
    if (req.user?.role !== 'ADMIN' && task.createdById !== req.user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.task.delete({
      where: { id: req.params.id as string }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ─── PATCH /api/tasks/:id/assign ──────────────────────────────────────────
// Admin only - assign task to another user by email
router.patch('/:id/assign', async (req: AuthenticatedRequest, res) => {
  try {
    // Only admins can assign tasks
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can assign tasks' });
    }

    const { assigneeEmail } = req.body;

    if (!assigneeEmail || typeof assigneeEmail !== 'string') {
      return res.status(400).json({ error: 'Assignee email is required and must be a string' });
    }

    // Find user by email
    const assignee = await prisma.user.findUnique({
      where: { email: assigneeEmail as string }
    });

    if (!assignee) {
      return res.status(404).json({ error: `User with email ${assigneeEmail} not found` });
    }

    // Find and update task
    const task = await prisma.task.findUnique({
      where: { id: req.params.id as string }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id as string },
      data: { assigneeId: assignee.id },
      include: {
        createdBy: { select: { id: true, email: true, name: true } },
        assignedTo: { select: { id: true, email: true, name: true } }
      }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ error: 'Failed to assign task' });
  }
});

export default router;
