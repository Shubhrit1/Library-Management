import prisma from '../DB/db.config.js';

export const getAllBooks = async (query = {}) => {
  const { search, author, publisher, available, page = 1, limit = 10 } = query;
  
  const skip = (page - 1) * limit;
  
  // Build where clause
  const where = {};
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { author: { contains: search, mode: 'insensitive' } },
      { isbn: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (author) {
    where.author = { contains: author, mode: 'insensitive' };
  }
  
  if (publisher) {
    where.publisher = { contains: publisher, mode: 'insensitive' };
  }
  
  if (available !== undefined) {
    if (available === 'true') {
      where.availableCopies = { gt: 0 };
    } else if (available === 'false') {
      where.availableCopies = { equals: 0 };
    }
  }
  
  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        updatedBy: {
          select: { id: true, name: true, email: true }
        }
      }
    }),
    prisma.book.count({ where })
  ]);
  
  return {
    books,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getBookById = async (id) => prisma.book.findUnique({ 
  where: { id },
  include: {
    createdBy: {
      select: { id: true, name: true, email: true }
    },
    updatedBy: {
      select: { id: true, name: true, email: true }
    },
    borrowRecords: {
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    }
  }
});

export const createBook = async (data) => prisma.book.create({ 
  data,
  include: {
    createdBy: {
      select: { id: true, name: true, email: true }
    }
  }
});

export const updateBook = async (id, data) => prisma.book.update({ 
  where: { id }, 
  data,
  include: {
    createdBy: {
      select: { id: true, name: true, email: true }
    },
    updatedBy: {
      select: { id: true, name: true, email: true }
    }
  }
});

export const deleteBook = async (id) => {
  try {
    console.log('=== DELETE BOOK DEBUG ===');
    console.log('Attempting to delete book with ID:', id);
    
    // First, check if book has any active borrow records
    const activeBorrows = await prisma.borrowRecord.findMany({
      where: {
        bookId: id,
        returnedAt: null
      }
    });

    console.log('Active borrows found:', activeBorrows.length);

    if (activeBorrows.length > 0) {
      throw new Error(`Cannot delete book: Book has ${activeBorrows.length} active borrow records. Please return all books first.`);
    }

    console.log('No active borrows, proceeding with deletion...');

    // Delete book with all related records in a transaction
    return await prisma.$transaction(async (tx) => {
      console.log('Starting transaction...');
      
      // Delete fines associated with this book's borrow records
      const deletedFines = await tx.fine.deleteMany({
        where: {
          borrowRecord: {
            bookId: id
          }
        }
      });
      console.log('Deleted fines:', deletedFines.count);

      // Delete borrow records
      const deletedBorrows = await tx.borrowRecord.deleteMany({
        where: { bookId: id }
      });
      console.log('Deleted borrow records:', deletedBorrows.count);

      // Delete wishlist items
      const deletedWishlist = await tx.wishlist.deleteMany({
        where: { bookId: id }
      });
      console.log('Deleted wishlist items:', deletedWishlist.count);

      // Finally delete the book
      const deletedBook = await tx.book.delete({ where: { id } });
      console.log('Book deleted successfully:', deletedBook.id);
      
      return deletedBook;
    });
  } catch (error) {
    console.error('Error in deleteBook:', error);
    if (error.code === 'P2025') {
      throw new Error('Book not found');
    }
    throw error;
  }
};

export const getBookByISBN = async (isbn) => prisma.book.findUnique({ where: { isbn } });

// Search books with advanced filtering
export const searchBooks = async (searchTerm, filters = {}) => {
  const { author, publisher, available, sortBy = 'title', sortOrder = 'asc' } = filters;
  
  const where = {
    OR: [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { author: { contains: searchTerm, mode: 'insensitive' } },
      { isbn: { contains: searchTerm, mode: 'insensitive' } }
    ]
  };
  
  if (author) where.author = { contains: author, mode: 'insensitive' };
  if (publisher) where.publisher = { contains: publisher, mode: 'insensitive' };
  if (available !== undefined) {
    where.availableCopies = available ? { gt: 0 } : { equals: 0 };
  }
  
  return prisma.book.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};
