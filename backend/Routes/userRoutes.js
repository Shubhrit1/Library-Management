import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { generalLimiter, adminActionLimiter } from '../middleware/rateLimit.js';
import { validateUser, validateUserUpdate, validateId } from '../middleware/validation.js';

const router = express.Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// Public routes (if any)
// Protected routes
router.get('/', authenticateToken, requireRole(['ADMIN', 'LIBRARIAN']), userController.getAllUsers);
router.get('/:id', authenticateToken, validateId, userController.getUserById);
router.post('/', authenticateToken, requireRole(['ADMIN']), adminActionLimiter, validateUser, userController.createUser);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), adminActionLimiter, validateId, validateUserUpdate, userController.updateUser);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), adminActionLimiter, validateId, userController.deleteUser);

export default router;
