# Library Management System - Frontend

A modern, responsive React frontend for the Library Management System built with DaisyUI and Tailwind CSS.

## 🚀 Features

- **Beautiful UI/UX** with DaisyUI components
- **Responsive Design** that works on all devices
- **Role-based Dashboards** for Librarians and Users
- **Real-time Search** and filtering
- **Interactive Book Management** with modals and forms
- **User Authentication** with JWT tokens
- **Modern React Hooks** and functional components

## 🛠️ Tech Stack

- **React 18** with modern hooks
- **Vite** for fast development and building
- **DaisyUI** for beautiful UI components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## 🔧 Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3001`

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── librarian/          # Librarian dashboard components
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── BookManagement.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── BorrowRecords.jsx
│   │   │   ├── FineManagement.jsx
│   │   │   └── Reports.jsx
│   │   ├── user/              # User dashboard components
│   │   │   ├── UserHome.jsx
│   │   │   ├── BookCatalog.jsx
│   │   │   ├── MyBorrowings.jsx
│   │   │   └── Profile.jsx
│   │   └── LoadingSpinner.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── pages/
│   │   ├── LoginPage.jsx      # Login page
│   │   ├── RegisterPage.jsx   # Registration page
│   │   ├── LibrarianDashboard.jsx
│   │   └── UserDashboard.jsx
│   ├── App.jsx               # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔐 Authentication

The frontend uses JWT tokens for authentication:

- **Login**: Users can log in with email/password
- **Registration**: New users can create accounts
- **Protected Routes**: Role-based access control
- **Token Refresh**: Automatic token refresh handling

## 🎯 User Roles

### Librarian Dashboard
- **Dashboard Home**: Overview with statistics
- **Book Management**: Add, edit, delete books
- **User Management**: Manage library users
- **Borrow Records**: Track all borrowing activity
- **Fine Management**: Handle library fines
- **Reports**: View analytics and reports

### User Dashboard
- **Home**: Personal overview and quick actions
- **Book Catalog**: Browse and search books
- **My Borrowings**: Track personal borrowing history
- **Profile**: Manage account information

## 🎨 UI Components

The frontend uses DaisyUI components for a consistent and beautiful design:

- **Cards**: For content organization
- **Modals**: For forms and detailed views
- **Tables**: For data display
- **Forms**: For user input
- **Buttons**: For actions
- **Badges**: For status indicators
- **Loading Spinners**: For loading states

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

### Vite Configuration
The frontend is configured to proxy API requests to the backend:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Configure your backend URL** in the environment variables

## 🧪 Testing

The frontend includes basic error handling and user feedback:

- **Toast notifications** for success/error messages
- **Loading states** for async operations
- **Form validation** for user inputs
- **Error boundaries** for React errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📱 Responsive Design

The frontend is fully responsive and works on:

- **Desktop**: Full-featured dashboard
- **Tablet**: Optimized layout
- **Mobile**: Mobile-friendly navigation

## 🎨 Customization

### Themes
You can customize the DaisyUI theme in `tailwind.config.js`:

```javascript
daisyui: {
  themes: [
    {
      library: {
        "primary": "#1e40af",
        "secondary": "#7c3aed",
        // ... more colors
      },
    },
  ],
}
```

### Styling
Custom styles can be added in `src/index.css`:

```css
@layer components {
  .btn-primary {
    @apply bg-primary text-primary-content hover:bg-primary-focus;
  }
}
```

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.

