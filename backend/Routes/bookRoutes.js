import express from 'express';
import * as bookController from '../controllers/bookController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { generalLimiter, adminActionLimiter } from '../middleware/rateLimit.js';
import { validateBook, validateBookUpdate, validateId } from '../middleware/validation.js';

const router = express.Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', validateId, bookController.getBookById);

// Protected routes
router.post('/', authenticateToken, requireRole(['ADMIN', 'LIBRARIAN']), adminActionLimiter, validateBook, bookController.createBook);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'LIBRARIAN']), adminActionLimiter, validateId, validateBookUpdate, bookController.updateBook);
router.delete('/:id', authenticateToken, requireRole(['ADMIN', 'LIBRARIAN']), adminActionLimiter, validateId, bookController.deleteBook);

export default router;
