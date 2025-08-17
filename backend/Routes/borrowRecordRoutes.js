import express from 'express';
import * as borrowRecordController from '../controllers/borrowRecordController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { generalLimiter, borrowLimiter } from '../middleware/rateLimit.js';
import { validateBorrowRecord, validateFine, validateId } from '../middleware/validation.js';

const router = express.Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// Protected routes
router.get('/', authenticateToken, requireRole(['ADMIN', 'LIBRARIAN']), borrowRecordController.getAllBorrowRecords);
router.get('/my', authenticateToken, borrowRecordController.getMyBorrowRecords); // New route for users
router.get('/:id', authenticateToken, validateId, borrowRecordController.getBorrowRecordById);
router.post('/', authenticateToken, borrowLimiter, validateBorrowRecord, borrowRecordController.createBorrowRecord);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'LIBRARIAN']), validateId, borrowRecordController.updateBorrowRecord);
router.post('/:id/return', authenticateToken, validateId, borrowRecordController.returnBook); // New return route
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), validateId, borrowRecordController.deleteBorrowRecord);

// Fine routes
router.get('/:borrowRecordId/fines', authenticateToken, validateId, borrowRecordController.getFinesByBorrowRecord);
router.post('/fines', authenticateToken, requireRole(['ADMIN', 'LIBRARIAN']), validateFine, borrowRecordController.createFine);
router.put('/fines/:id', authenticateToken, requireRole(['ADMIN', 'LIBRARIAN']), validateId, borrowRecordController.updateFine);
router.delete('/fines/:id', authenticateToken, requireRole(['ADMIN']), validateId, borrowRecordController.deleteFine);

export default router;
