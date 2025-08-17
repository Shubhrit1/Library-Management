import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
} from 'lucide-react';
import axios from 'axios';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrowings: 0,
    totalFines: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch books
      const booksResponse = await axios.get('/api/books?limit=1');
      const totalBooks = booksResponse.data.pagination?.total || 0;

      // Fetch users
      const usersResponse = await axios.get('/api/users');
      const totalUsers = usersResponse.data.length || 0;

      // Fetch borrow records
      const borrowResponse = await axios.get('/api/borrow-records');
      const activeBorrowings = borrowResponse.data.filter(record => !record.returnedAt).length;

      // Fetch fines
      const finesResponse = await axios.get('/api/borrow-records/fines');
      const totalFines = finesResponse.data.reduce((sum, fine) => sum + fine.amount, 0);

      setStats({
        totalBooks,
        totalUsers,
        activeBorrowings,
        totalFines,
      });

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: 'borrow',
          user: 'John Doe',
          book: 'The Great Gatsby',
          time: '2 hours ago',
        },
        {
          id: 2,
          type: 'return',
          user: 'Jane Smith',
          book: 'To Kill a Mockingbird',
          time: '4 hours ago',
        },
        {
          id: 3,
          type: 'fine',
          user: 'Mike Johnson',
          book: '1984',
          amount: 5.00,
          time: '1 day ago',
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: 'Active Borrowings',
      value: stats.activeBorrowings,
      icon: FileText,
      color: 'bg-yellow-500',
      change: '-3%',
      changeType: 'decrease',
    },
    {
      title: 'Total Fines',
      value: `$${stats.totalFines.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-red-500',
      change: '+8%',
      changeType: 'increase',
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening in your library.</p>
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
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-base-200 rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'borrow' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      {activity.type === 'return' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      {activity.type === 'fine' && (
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-red-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {activity.user} {activity.type === 'borrow' && 'borrowed'}
                        {activity.type === 'return' && 'returned'}
                        {activity.type === 'fine' && 'received a fine for'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.book}
                        {activity.amount && ` - $${activity.amount}`}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
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
                  Add New Book
                </button>
                <button className="btn btn-outline w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Register User
                </button>
                <button className="btn btn-outline w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Process Return
                </button>
                <button className="btn btn-outline w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Manage Fines
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Due Dates */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold">Due Soon</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">John Doe</p>
                    <p className="text-sm text-gray-600">The Great Gatsby</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-600">Due Today</p>
                    <Clock className="w-4 h-4 text-yellow-600 mt-1" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Jane Smith</p>
                    <p className="text-sm text-gray-600">To Kill a Mockingbird</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">Due Tomorrow</p>
                    <Calendar className="w-4 h-4 text-orange-600 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

