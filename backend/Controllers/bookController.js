import * as bookService from '../services/bookService.js';

export const getAllBooks = async (req, res) => {
  try {
    const result = await bookService.getAllBooks(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error.message);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

export const createBook = async (req, res) => {
  try {
    console.log('=== CREATE BOOK DEBUG ===');
    console.log('Request body:', req.body);
    console.log('User from request:', req.user);
    console.log('Headers:', req.headers);
    
    const { title, author, isbn, publisher, publishedYear, availableCopies } = req.body;

    if (!title || !author) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: title, author' });
    }

    if (isbn) {
      const existingBook = await bookService.getBookByISBN(isbn);
      if (existingBook) {
        console.log('ISBN already exists');
        return res.status(400).json({ error: 'ISBN already exists' });
      }
    }

    // Add current user context
    const bookData = {
      ...req.body,
      createdById: req.user.id,
      updatedById: req.user.id,
      // Convert string values to proper types
      publishedYear: req.body.publishedYear ? parseInt(req.body.publishedYear) : null,
      availableCopies: parseInt(req.body.availableCopies) || 1
    };
    
    console.log('Book data to create:', bookData);

    const book = await bookService.createBook(bookData);
    console.log('Book created successfully:', book);
    res.status(201).json(book);
  } catch (error) {
    console.error('=== CREATE BOOK ERROR ===');
    console.error('Error creating book:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    console.error('Error meta:', error.meta);
    
    // Handle Prisma validation errors
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A book with this ISBN already exists' });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid user reference' });
    }
    
    res.status(500).json({ error: 'Failed to create book', details: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { isbn } = req.body;

    const book = await bookService.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (isbn) {
      const existingBook = await bookService.getBookByISBN(isbn);
      if (existingBook && existingBook.id !== id) {
        return res.status(400).json({ error: 'ISBN already exists' });
      }
    }

    // Add current user context for update
    const updateData = {
      ...req.body,
      updatedById: req.user.id,
      // Convert string values to proper types
      publishedYear: req.body.publishedYear ? parseInt(req.body.publishedYear) : undefined,
      availableCopies: req.body.availableCopies ? parseInt(req.body.availableCopies) : undefined
    };

    const updatedBook = await bookService.updateBook(id, updateData);
    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error.message);
    
    // Handle Prisma validation errors
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A book with this ISBN already exists' });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid user reference' });
    }
    
    res.status(500).json({ error: 'Failed to update book' });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await bookService.deleteBook(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error.message);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};
