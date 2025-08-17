import prisma from '../DB/db.config.js';

// Add book to user's wishlist
export const addToWishlist = async (userId, bookId, notes = null) => {
  return prisma.wishlist.create({
    data: {
      userId,
      bookId,
      notes
    },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          publisher: true,
          isbn: true,
          publishedYear: true,
          imageUrl: true,
          availableCopies: true
        }
      }
    }
  });
};

// Remove book from user's wishlist
export const removeFromWishlist = async (userId, bookId) => {
  return prisma.wishlist.deleteMany({
    where: {
      userId,
      bookId
    }
  });
};

// Get user's wishlist
export const getUserWishlist = async (userId) => {
  return prisma.wishlist.findMany({
    where: { userId },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          publisher: true,
          isbn: true,
          publishedYear: true,
          imageUrl: true,
          availableCopies: true
        }
      }
    },
    orderBy: { addedAt: 'desc' }
  });
};

// Check if book is in user's wishlist
export const isInWishlist = async (userId, bookId) => {
  const wishlistItem = await prisma.wishlist.findFirst({
    where: {
      userId,
      bookId
    }
  });
  return !!wishlistItem;
};

// Get wishlist item by ID
export const getWishlistItemById = async (id) => {
  return prisma.wishlist.findUnique({
    where: { id },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          publisher: true,
          isbn: true,
          publishedYear: true,
          imageUrl: true,
          availableCopies: true
        }
      }
    }
  });
}; 