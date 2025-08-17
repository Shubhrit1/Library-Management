# 📚 Library Management System - Setup & Deployment Guide

This guide will walk you through setting up and deploying your own Library Management System from the Git repository, including setting up your own PostgreSQL database.

## 🚀 Quick Start Overview

1. **Clone the repository**
2. **Set up PostgreSQL database**
3. **Configure environment variables**
4. **Install dependencies**
5. **Set up the database**
6. **Start the application**
7. **Deploy to production (optional)**

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)

---

## 🔧 Step-by-Step Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Shubhrit1/Library-Management.git

# Navigate to the project directory
cd Library-Management
```

### 2. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL Installation

**Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. PostgreSQL will be available at `localhost:5432`

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Or download from postgresql.org
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Option B: Cloud Database (Recommended for Production)

**Railway (Free tier available):**
1. Go to [railway.app](https://railway.app/)
2. Create an account and new project
3. Add PostgreSQL service
4. Copy the connection string

**Supabase (Free tier available):**
1. Go to [supabase.com](https://supabase.com/)
2. Create an account and new project
3. Go to Settings > Database
4. Copy the connection string

**Neon (Free tier available):**
1. Go to [neon.tech](https://neon.tech/)
2. Create an account and new project
3. Copy the connection string

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE library_management;

# Create a dedicated user (optional but recommended)
CREATE USER library_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE library_management TO library_user;

# Exit psql
\q
```

### 3. Configure Environment Variables

#### Backend Configuration

```bash
# Navigate to backend directory
cd backend

# Copy the example environment file
cp config.env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/library_management"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-make-it-long-and-random
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (Optional - for future implementation)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (Optional - for future implementation)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important Security Notes:**
- Generate strong JWT secrets (use a password generator)
- Never commit `.env` files to version control
- Use different secrets for development and production

### 4. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5. Set Up the Database

```bash
# Navigate back to backend directory
cd ../backend

# Generate Prisma client
npx prisma generate

# Push the database schema
npx prisma db push

# Seed the database with initial data
npx prisma db seed
```

### 6. Start the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Your application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

#### Production Mode

**Build the frontend:**
```bash
cd frontend
npm run build
```

**Start the backend:**
```bash
cd backend
npm start
```

---

## 🔐 Default Users

After seeding the database, you'll have these default users:

### Librarian Account
- **Email**: librarian@library.com
- **Password**: librarian123
- **Role**: LIBRARIAN

### User Account
- **Email**: user@library.com
- **Password**: user123
- **Role**: MEMBER

---

## 🚀 Deployment Options

### Option 1: Railway (Recommended for beginners)

1. **Connect your repository:**
   - Go to [railway.app](https://railway.app/)
   - Connect your GitHub repository
   - Railway will automatically detect the Node.js project

2. **Set up environment variables:**
   - Add all variables from your `.env` file
   - Use Railway's PostgreSQL service for the database

3. **Deploy:**
   - Railway will automatically deploy on every push to main branch

### Option 2: Render

1. **Create a new Web Service:**
   - Go to [render.com](https://render.com/)
   - Connect your GitHub repository
   - Choose "Web Service"

2. **Configure the service:**
   - **Build Command**: `cd backend && npm install && cd ../frontend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node

3. **Set environment variables:**
   - Add all variables from your `.env` file

### Option 3: Vercel + Railway

1. **Deploy backend to Railway** (as above)
2. **Deploy frontend to Vercel:**
   - Go to [vercel.com](https://vercel.com/)
   - Import your repository
   - Set root directory to `frontend`
   - Add environment variable: `VITE_API_URL=https://your-railway-backend-url.railway.app`

### Option 4: DigitalOcean App Platform

1. **Create a new app:**
   - Go to [digitalocean.com](https://digitalocean.com/)
   - Create a new App
   - Connect your GitHub repository

2. **Configure the app:**
   - Add PostgreSQL database
   - Set environment variables
   - Configure build and run commands

---

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d library_management
```

**Port Already in Use:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Prisma Issues:**
```bash
# Reset Prisma
npx prisma generate
npx prisma db push --force-reset
npx prisma db seed
```

**Node Modules Issues:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Checklist

- [ ] `DATABASE_URL` is correctly formatted
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- [ ] `PORT` is not conflicting with other services
- [ ] Database user has proper permissions

---

## 📊 Monitoring & Maintenance

### Database Management

```bash
# Access database
psql -U postgres -d library_management

# View tables
\dt

# View data
SELECT * FROM "User";

# Backup database
pg_dump -U postgres library_management > backup.sql

# Restore database
psql -U postgres library_management < backup.sql
```

### Logs

```bash
# Backend logs
cd backend
npm run server

# Check for errors in console output
```

---

## 🔒 Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database:**
   - Use strong passwords
   - Limit database access
   - Regular backups

3. **Production:**
   - Use HTTPS
   - Set up proper CORS
   - Implement rate limiting
   - Regular security updates

---

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Review the logs for error messages**
3. **Ensure all prerequisites are installed**
4. **Verify environment variables are correct**

For additional help:
- Create an issue on the GitHub repository
- Check the project documentation
- Review the API documentation in the README

---

## 🎉 You're All Set!

Your Library Management System should now be running successfully. You can:

- **Access the frontend** at http://localhost:5173
- **Test the API** at http://localhost:3000
- **Manage your database** using Prisma Studio: `npx prisma studio`

Happy coding! 🚀
