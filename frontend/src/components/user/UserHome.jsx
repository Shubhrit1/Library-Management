import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  BookOpen,
  FileText,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  Heart,
} from 'lucide-react';
import axios from 'axios';

const UserHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    overdueBooks: 0,
    totalFines: 0,
  });
  const [recentBorrowings, setRecentBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user's borrow records
      const response = await axios.get('/api/borrow-records');
      const userRecords = response.data.filter(record => record.userId === user.id);
      
      const totalBorrowed = userRecords.length;
      const currentlyBorrowed = userRecords.filter(record => !record.returnedAt).length;
      const overdueBooks = userRecords.filter(record => {
        if (record.returnedAt) return false;
        const borrowedDate = new Date(record.borrowedAt);
        const dueDate = new Date(borrowedDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days
        return new Date() > dueDate;
      }).length;

      setStats({
        totalBorrowed,
        currentlyBorrowed,
        overdueBooks,
        totalFines: 0, // This would be calculated from fines API
      });

      setRecentBorrowings(userRecords.slice(0, 5));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Books Borrowed',
      value: stats.totalBorrowed,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+2',
      changeType: 'increase',
    },
    {
      title: 'Currently Borrowed',
      value: stats.currentlyBorrowed,
      icon: FileText,
      color: 'bg-green-500',
      change: '0',
      changeType: 'neutral',
    },
    {
      title: 'Overdue Books',
      value: stats.overdueBooks,
      icon: Clock,
      color: 'bg-red-500',
      change: '0',
      changeType: 'neutral',
    },
    {
      title: 'Outstanding Fines',
      value: `$${stats.totalFines.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '$0.00',
      changeType: 'neutral',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-white/80 mt-2">Here's what's happening with your library account</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card bg-base-100 shadow-lg card-hover">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.changeType === 'increase' && (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {stat.change} this month
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Borrowings */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold">Recent Borrowings</h2>
              <div className="space-y-4">
                {recentBorrowings.length > 0 ? (
                  recentBorrowings.map((record) => (
                    <div key={record.id} className="flex items-center space-x-4 p-3 bg-base-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{record.book?.title}</p>
                        <p className="text-sm text-gray-600">by {record.book?.author}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(record.borrowedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`badge badge-sm mt-1 ${
                          record.returnedAt ? 'badge-success' : 'badge-warning'
                        }`}>
                          {record.returnedAt ? 'Returned' : 'Active'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No borrowings yet</h3>
                    <p className="text-gray-600">Start exploring our book collection!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold">Quick Actions</h2>
              <div className="space-y-3">
                <button className="btn btn-primary w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Books
                </button>
                <button className="btn btn-outline w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  My Borrowings
                </button>
                <button className="btn btn-outline w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </button>
                <button className="btn btn-outline w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pay Fines
                </button>
              </div>
            </div>
          </div>

          {/* Due Soon */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold">Due Soon</h2>
              <div className="space-y-3">
                {stats.currentlyBorrowed > 0 ? (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">The Great Gatsby</p>
                      <p className="text-sm text-gray-600">Due in 2 days</p>
                    </div>
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600">No books due soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Library Hours */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold">Library Hours</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>12:00 PM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;

