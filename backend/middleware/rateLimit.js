import rateLimit from 'express-rate-limit';

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000, // 1 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes (reduced from 15)
  max: 100, // limit each IP to 20 requests per windowMs (increased from 5)
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 300
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for book creation/updates (admin/librarian actions)
export const adminActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 requests per hour
  message: {
    error: 'Too many admin actions, please try again later.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for borrowing actions
export const borrowLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 borrow actions per hour
  message: {
    error: 'Too many borrowing actions, please try again later.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
});
