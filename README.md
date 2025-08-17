# 📚 Library Management System

A modern, full-stack library management system built with React frontend and Node.js backend, featuring role-based access control for librarians and users.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication system
- Role-based access control (Librarian/User)
- Secure password hashing
- Session management

### 👨‍💼 Librarian Features
- **Book Management**: Add, edit, delete, and search books
- **User Management**: Manage user accounts and permissions
- **Borrow Records**: Track all borrowing activities
- **Fine Management**: Handle overdue fines and payments
- **Reports**: Generate comprehensive library reports
- **Dashboard**: Real-time statistics and overview

### 👤 User Features
- **Book Catalog**: Browse and search available books
- **Borrowing**: Request and borrow books
- **My Borrowings**: Track personal borrowing history
- **Wishlist**: Save books for future reading
- **Profile Management**: Update personal information

### 🛠 Technical Features
- **Database**: Prisma ORM with SQLite/PostgreSQL support
- **API**: RESTful API with comprehensive endpoints
- **Validation**: Input validation and error handling
- **Rate Limiting**: API protection against abuse
- **Responsive Design**: Modern UI with Tailwind CSS

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Database ORM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **SQLite** (Development)
- **PostgreSQL** (Production ready)

## 📁 Project Structure

```
libary/
├── backend/                 # Node.js API server
│   ├── Controllers/        # Route controllers
│   ├── Routes/            # API routes
│   ├── Services/          # Business logic
│   ├── middleware/        # Custom middleware
│   ├── prisma/           # Database schema & migrations
│   └── server.js         # Server entry point
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── librarian/ # Librarian-specific components
│   │   │   └── user/     # User-specific components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   └── main.jsx      # App entry point
│   └── index.html        # HTML template
└── README.md             # This file
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubhrit1/Library-Management.git
   cd Library-Management/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp config.env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Book Endpoints
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book (Librarian only)
- `PUT /api/books/:id` - Update book (Librarian only)
- `DELETE /api/books/:id` - Delete book (Librarian only)

### Borrowing Endpoints
- `POST /api/borrow` - Borrow a book
- `GET /api/borrow/user/:userId` - Get user borrowings
- `PUT /api/borrow/:id/return` - Return a book

### User Endpoints
- `GET /api/users` - Get all users (Librarian only)
- `PUT /api/users/:id` - Update user (Librarian only)
- `DELETE /api/users/:id` - Delete user (Librarian only)

## 🎯 Usage Guide

### For Librarians
1. Register/Login with librarian credentials
2. Access the librarian dashboard
3. Manage books, users, and borrowing records
4. Generate reports and handle fines

### For Users
1. Register/Login with user credentials
2. Browse the book catalog
3. Borrow books and manage your account
4. Track your borrowing history

## 🔧 Development

### Running in Development Mode
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Database Migrations
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shubhrit1**
- GitHub: [@Shubhrit1](https://github.com/Shubhrit1)
- Email: shubhrit.fun@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS for the utility-first CSS framework
- Prisma team for the excellent ORM

---

⭐ If you find this project helpful, please give it a star on GitHub!
