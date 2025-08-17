import prisma from '../DB/db.config.js';

export const getAllBorrowRecords = async () => prisma.borrowRecord.findMany();
export const getBorrowRecordById = async (id) => prisma.borrowRecord.findUnique({ where: { id } });
export const createBorrowRecord = async (data) => prisma.borrowRecord.create({ data });
export const updateBorrowRecord = async (id, data) => prisma.borrowRecord.update({ where: { id }, data });
export const deleteBorrowRecord = async (id) => prisma.borrowRecord.delete({ where: { id } });

// Get borrow records for a specific user with book details
export const getBorrowRecordsByUserId = async (userId) => 
  prisma.borrowRecord.findMany({
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
          imageUrl: true
        }
      }
    },
    orderBy: { borrowedAt: 'desc' }
  });

// Check if user already has a specific book borrowed
export const getBorrowRecordByUserAndBook = async (userId, bookId) => 
  prisma.borrowRecord.findFirst({ 
    where: { 
      userId, 
      bookId,
      returnedAt: null // Only check unreturned books
    } 
  });

export const getFinesByBorrowRecordId = async (borrowRecordId) => 
  prisma.fine.findMany({ where: { borrowRecordId } });

export const createFine = async (data) => prisma.fine.create({ data });

export const updateFine = async (id, data) => prisma.fine.update({ where: { id }, data });

export const deleteFine = async (id) => prisma.fine.delete({ where: { id } });

export const getFineById = async (id) => prisma.fine.findUnique({ where: { id } });
