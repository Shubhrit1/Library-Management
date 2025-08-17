# Library Management System - Backend API

A robust REST API for managing a library system with user authentication, book management, borrowing records, and fine tracking.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (ADMIN, LIBRARIAN, MEMBER)
  - Password hashing with bcrypt
  - Google OAuth support (ready for implementation)

- **Book Management**
  - CRUD operations for books
  - Advanced search and filtering
  - Pagination support
  - ISBN validation
  - Available copies tracking

- **User Management**
  - User registration and login
  - Profile management
  - Role-based permissions

- **Borrowing System**
  - Create and manage borrow records
  - Return tracking
  - Fine management

- **Security & Performance**
  - Rate limiting
  - Input validation
  - CORS configuration
  - Error handling
  - Request logging

## 🛠️ Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd libary/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp config.env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run server
   
   # Production mode
   npm start
   ```

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/library_db"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (optional, for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Users (Admin/Librarian only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Books
- `GET /api/books` - Get all books (with search/filtering)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (Admin/Librarian)
- `PUT /api/books/:id` - Update book (Admin/Librarian)
- `DELETE /api/books/:id` - Delete book (Admin)

### Borrow Records
- `GET /api/borrow-records` - Get all borrow records (Admin/Librarian)
- `GET /api/borrow-records/:id` - Get borrow record by ID
- `POST /api/borrow-records` - Create borrow record
- `PUT /api/borrow-records/:id` - Update borrow record (Admin/Librarian)
- `DELETE /api/borrow-records/:id` - Delete borrow record (Admin)

### Fines
- `GET /api/borrow-records/:borrowRecordId/fines` - Get fines for borrow record
- `POST /api/borrow-records/fines` - Create fine (Admin/Librarian)
- `PUT /api/borrow-records/fines/:id` - Update fine (Admin/Librarian)
- `DELETE /api/borrow-records/fines/:id` - Delete fine (Admin)

## 🔍 Search & Filtering

### Books Search Parameters
- `search` - Search in title, author, or ISBN
- `author` - Filter by author
- `publisher` - Filter by publisher
- `available` - Filter by availability (true/false)
- `page` - Page number for pagination
- `limit` - Items per page

**Example:**
```
GET /api/books?search=harry&author=rowling&available=true&page=1&limit=10
```

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

### Role-Based Access

- **ADMIN**: Full access to all endpoints
- **LIBRARIAN**: Can manage books and borrow records, limited user management
- **MEMBER**: Can view books and create borrow records

## 📝 Request Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a book (with authentication)
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-access-token>" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publisher": "Scribner",
    "isbn": "978-0743273565",
    "publishedYear": 1925,
    "availableCopies": 5
  }'
```

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (if available)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📊 Health Check

Check if the server is running:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🔄 Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 📦 Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Set up a reverse proxy (nginx)
5. Use PM2 or similar process manager
6. Set up proper logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.
