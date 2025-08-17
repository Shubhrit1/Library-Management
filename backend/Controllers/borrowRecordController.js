import * as borrowRecordService from '../services/borrowRecordService.js';
import * as userService from '../services/userService.js';
import * as bookService from '../services/bookService.js';

export const getAllBorrowRecords = async (req, res) => {
  try {
    const records = await borrowRecordService.getAllBorrowRecords();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrow records' });
  }
};

export const getBorrowRecordById = async (req, res) => {
  try {
    const record = await borrowRecordService.getBorrowRecordById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrow record' });
  }
};

export const getMyBorrowRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await borrowRecordService.getBorrowRecordsByUserId(userId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching user borrow records:', error.message);
    res.status(500).json({ error: 'Failed to fetch borrow records' });
  }
};

export const createBorrowRecord = async (req, res) => {
  try {
    console.log('=== CREATE BORROW RECORD DEBUG ===');
    console.log('Request body:', req.body);
    console.log('User from request:', req.user);
    
    const { bookId } = req.body;
    const userId = req.user.id; // Get user ID from authenticated request

    if (!bookId) {
      return res.status(400).json({ error: 'Missing required field: bookId' });
    }

    // Check if user exists
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if book exists
    const book = await bookService.getBookById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({ error: 'Book is not available for borrowing' });
    }

    // Check if user already has this book borrowed
    const existingBorrow = await borrowRecordService.getBorrowRecordByUserAndBook(userId, bookId);
    if (existingBorrow && !existingBorrow.returnedAt) {
      return res.status(400).json({ error: 'You already have this book borrowed' });
    }

    // Create borrow record
    const borrowData = {
      userId,
      bookId,
      borrowedAt: new Date()
    };

    const record = await borrowRecordService.createBorrowRecord(borrowData);
    
    // Update book availability
    await bookService.updateBook(bookId, {
      availableCopies: book.availableCopies - 1
    });
    
    console.log('Borrow record created successfully:', record);
    res.status(201).json(record);
  } catch (error) {
    console.error('=== CREATE BORROW RECORD ERROR ===');
    console.error('Error creating borrow record:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ error: 'Failed to create borrow record', details: error.message });
  }
};

export const updateBorrowRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await borrowRecordService.getBorrowRecordById(id);
    if (!record) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    const updatedRecord = await borrowRecordService.updateBorrowRecord(id, req.body);
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update borrow record' });
  }
};

export const returnBook = async (req, res) => {
  try {
    console.log('=== RETURN BOOK DEBUG ===');
    console.log('Request params:', req.params);
    console.log('User from request:', req.user);
    
    const { id } = req.params;
    const userId = req.user.id;

    // Get the borrow record
    const record = await borrowRecordService.getBorrowRecordById(id);
    if (!record) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    // Check if the user owns this borrow record
    if (record.userId !== userId) {
      return res.status(403).json({ error: 'You can only return your own borrowed books' });
    }

    // Check if the book is already returned
    if (record.returnedAt) {
      return res.status(400).json({ error: 'This book has already been returned' });
    }

    // Update the borrow record with return date
    const updatedRecord = await borrowRecordService.updateBorrowRecord(id, {
      returnedAt: new Date()
    });

    // Update book availability (increase available copies)
    const book = await bookService.getBookById(record.bookId);
    if (book) {
      await bookService.updateBook(record.bookId, {
        availableCopies: book.availableCopies + 1
      });
    }

    console.log('Book returned successfully:', updatedRecord);
    res.json({ 
      message: 'Book returned successfully',
      record: updatedRecord 
    });
  } catch (error) {
    console.error('=== RETURN BOOK ERROR ===');
    console.error('Error returning book:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ error: 'Failed to return book', details: error.message });
  }
};

export const deleteBorrowRecord = async (req, res) => {
  try {
    const record = await borrowRecordService.getBorrowRecordById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    await borrowRecordService.deleteBorrowRecord(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete borrow record' });
  }
};

export const getFinesByBorrowRecord = async (req, res) => {
  try {
    const { borrowRecordId } = req.params;

    const fines = await borrowRecordService.getFinesByBorrowRecordId(borrowRecordId);
    res.json(fines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fines' });
  }
};

export const createFine = async (req, res) => {
  try {
    const { borrowRecordId } = req.body;

    // Validate that the borrow record exists
    const borrowRecord = await borrowRecordService.getBorrowRecordById(borrowRecordId);
    if (!borrowRecord) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    const fine = await borrowRecordService.createFine(req.body);
    res.status(201).json(fine);
  } catch (error) {
    console.error('Error creating fine:', error.message);
    res.status(500).json({ error: 'Failed to create fine' });
  }
};

export const updateFine = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the fine exists
    const fine = await borrowRecordService.getFineById(id);
    if (!fine) {
      return res.status(404).json({ error: 'Fine not found' });
    }

    const updatedFine = await borrowRecordService.updateFine(id, req.body);
    res.json(updatedFine);
  } catch (error) {
    console.error('Error updating fine:', error.message);
    res.status(500).json({ error: 'Failed to update fine' });
  }
};

export const deleteFine = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the fine exists
    const fine = await borrowRecordService.getFineById(id);
    if (!fine) {
      return res.status(404).json({ error: 'Fine not found' });
    }

    await borrowRecordService.deleteFine(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting fine:', error.message);
    res.status(500).json({ error: 'Failed to delete fine' });
  }
};
