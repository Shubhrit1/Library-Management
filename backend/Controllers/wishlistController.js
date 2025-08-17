import * as wishlistService from '../Services/wishlistService.js';
import * as bookService from '../Services/bookService.js';

// Add book to wishlist
export const addToWishlist = async (req, res) => {
  try {
    console.log('=== ADD TO WISHLIST DEBUG ===');
    console.log('Request body:', req.body);
    console.log('User from request:', req.user);
    
    const { bookId, notes } = req.body;
    const userId = req.user.id;

    if (!bookId) {
      return res.status(400).json({ error: 'Missing required field: bookId' });
    }

    // Check if book exists
    const book = await bookService.getBookById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if already in wishlist
    const alreadyInWishlist = await wishlistService.isInWishlist(userId, bookId);
    if (alreadyInWishlist) {
      return res.status(400).json({ error: 'Book is already in your wishlist' });
    }

    // Add to wishlist
    const wishlistItem = await wishlistService.addToWishlist(userId, bookId, notes);
    
    console.log('Book added to wishlist successfully:', wishlistItem);
    res.status(201).json({ 
      message: 'Book added to wishlist successfully',
      wishlistItem 
    });
  } catch (error) {
    console.error('=== ADD TO WISHLIST ERROR ===');
    console.error('Error adding to wishlist:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ error: 'Failed to add book to wishlist', details: error.message });
  }
};

// Remove book from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    console.log('=== REMOVE FROM WISHLIST DEBUG ===');
    console.log('Request params:', req.params);
    console.log('User from request:', req.user);
    
    const { bookId } = req.params;
    const userId = req.user.id;

    // Check if book exists in wishlist
    const inWishlist = await wishlistService.isInWishlist(userId, bookId);
    if (!inWishlist) {
      return res.status(404).json({ error: 'Book not found in wishlist' });
    }

    // Remove from wishlist
    await wishlistService.removeFromWishlist(userId, bookId);
    
    console.log('Book removed from wishlist successfully');
    res.json({ message: 'Book removed from wishlist successfully' });
  } catch (error) {
    console.error('=== REMOVE FROM WISHLIST ERROR ===');
    console.error('Error removing from wishlist:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ error: 'Failed to remove book from wishlist', details: error.message });
  }
};

// Get user's wishlist
export const getUserWishlist = async (req, res) => {
  try {
    console.log('=== GET USER WISHLIST DEBUG ===');
    console.log('User from request:', req.user);
    
    const userId = req.user.id;
    const wishlist = await wishlistService.getUserWishlist(userId);
    
    console.log('Wishlist retrieved successfully:', wishlist.length, 'items');
    res.json(wishlist);
  } catch (error) {
    console.error('=== GET USER WISHLIST ERROR ===');
    console.error('Error getting wishlist:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ error: 'Failed to get wishlist', details: error.message });
  }
};

// Check if book is in user's wishlist
export const checkWishlistStatus = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const inWishlist = await wishlistService.isInWishlist(userId, bookId);
    res.json({ inWishlist });
  } catch (error) {
    console.error('Error checking wishlist status:', error.message);
    res.status(500).json({ error: 'Failed to check wishlist status' });
  }
}; 