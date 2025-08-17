import express from 'express';
import * as wishlistController from '../Controllers/wishlistController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// All routes require authentication
router.use(authenticateToken);

// Wishlist routes
router.post('/add', wishlistController.addToWishlist);
router.delete('/remove/:bookId', wishlistController.removeFromWishlist);
router.get('/my', wishlistController.getUserWishlist);
router.get('/check/:bookId', wishlistController.checkWishlistStatus);

export default router; 