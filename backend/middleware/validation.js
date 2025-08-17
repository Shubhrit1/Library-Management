import { body, param, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// User validation rules
export const validateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('passwordHash')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  handleValidationErrors
];

// Book validation rules
export const validateBook = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('publisher')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Publisher must be less than 100 characters'),
  body('isbn')
    .optional()
    .trim()
    .isLength({ min: 10, max: 13 })
    .withMessage('ISBN must be between 10 and 13 characters'),
  body('publishedYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Published year must be between 1000 and current year'),
  body('availableCopies')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available copies must be a non-negative integer'),
  handleValidationErrors
];

export const validateBookUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('publisher')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Publisher must be less than 100 characters'),
  body('isbn')
    .optional()
    .trim()
    .isLength({ min: 10, max: 13 })
    .withMessage('ISBN must be between 10 and 13 characters'),
  body('publishedYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Published year must be between 1000 and current year'),
  body('availableCopies')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available copies must be a non-negative integer'),
  handleValidationErrors
];

// Borrow record validation rules
export const validateBorrowRecord = [
  body('bookId')
    .isLength({ min: 20, max: 25 })
    .matches(/^[a-z][a-z0-9]*$/)
    .withMessage('Book ID must be a valid CUID format'),
  handleValidationErrors
];

// Fine validation rules
export const validateFine = [
  body('borrowRecordId')
    .isLength({ min: 20, max: 25 })
    .matches(/^[a-z][a-z0-9]*$/)
    .withMessage('Borrow record ID must be a valid CUID format'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a non-negative number'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Reason must be less than 200 characters'),
  handleValidationErrors
];

// ID parameter validation
export const validateId = [
  param('id')
    .isLength({ min: 20, max: 25 })
    .matches(/^[a-z][a-z0-9]*$/)
    .withMessage('ID must be a valid CUID format'),
  handleValidationErrors
];
