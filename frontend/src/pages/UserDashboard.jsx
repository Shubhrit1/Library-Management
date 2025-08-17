import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpen,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  Heart,
  Clock,
} from 'lucide-react';
import UserHome from '../components/user/UserHome';
import BookCatalog from '../components/user/BookCatalog';
import MyBorrowings from '../components/user/MyBorrowings';
import Wishlist from '../components/user/Wishlist';
import Profile from '../components/user/Profile';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/user', icon: Home },
    { name: 'Book Catalog', href: '/user/catalog', icon: BookOpen },
    { name: 'My Borrowings', href: '/user/borrowings', icon: FileText },
    { name: 'Wishlist', href: '/user/wishlist', icon: Heart },
    { name: 'Profile', href: '/user/profile', icon: User },
  ];

  const isActive = (path) => {
    if (path === '/user') {
      return location.pathname === '/user';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header - Full width at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-sm border-b border-base-300">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Library</h1>
              <p className="text-sm text-gray-600">Member Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-base-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main container with flexbox layout */}
      <div className="flex pt-[73px] min-h-screen">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ top: '73px', height: 'calc(100vh - 73px)' }}
        >
          <div className="flex flex-col h-full">
            {/* User Info */}
            <div className="p-6 border-b border-base-300">
              <div className="flex items-center space-x-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-12">
                    <span className="text-lg font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-600">Library Member</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-content'
                        : 'text-gray-700 hover:bg-base-300'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-base-300">
              <button
                onClick={logout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top Bar */}
          <div className="bg-base-100 shadow-sm border-b border-base-300">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search books..."
                    className="input input-sm input-bordered w-64"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4" />
                    <span>Wishlist</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Due Soon</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            <Routes>
              <Route path="/" element={<UserHome />} />
              <Route path="/catalog" element={<BookCatalog />} />
              <Route path="/borrowings" element={<MyBorrowings />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

