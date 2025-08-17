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

export const deleteBook = async (id) => prisma.book.delete({ where: { id } });
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
