import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyBorrowings = () => {
  const { user } = useAuth();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const response = await axios.get('/api/borrow-records/my');
      setBorrowings(response.data);
    } catch (error) {
      console.error('Error fetching borrowings:', error);
      toast.error('Failed to fetch borrowings');
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async (borrowRecordId) => {
    try {
      // Add confirmation dialog
      if (!window.confirm('Are you sure you want to return this book?')) {
        return;
      }
      
      await axios.post(`/api/borrow-records/${borrowRecordId}/return`);
      toast.success('Book returned successfully!');
      fetchBorrowings(); // Refresh the list
    } catch (error) {
      console.error('Error returning book:', error);
      const errorMessage = error.response?.data?.error || 'Failed to return book';
      toast.error(errorMessage);
    }
  };

  const getDueDate = (borrowedAt) => {
    const borrowedDate = new Date(borrowedAt);
    return new Date(borrowedDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days
  };

  const isOverdue = (borrowedAt) => {
    const dueDate = getDueDate(borrowedAt);
    return new Date() > dueDate;
  };

  const getDaysRemaining = (borrowedAt) => {
    const dueDate = getDueDate(borrowedAt);
    const now = new Date();
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredBorrowings = borrowings.filter((borrowing) => {
    if (filter === 'all') return true;
    if (filter === 'active' && !borrowing.returnedAt) return true;
    if (filter === 'returned' && borrowing.returnedAt) return true;
    if (filter === 'overdue' && !borrowing.returnedAt && isOverdue(borrowing.borrowedAt)) return true;
    return false;
  });

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
        <h1 className="text-3xl font-bold text-gray-800">My Borrowings</h1>
        <p className="text-gray-600 mt-2">Track your borrowed books and due dates</p>
      </div>

      {/* Filter */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Filter:</span>
            <select
              className="select select-bordered"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Borrowings</option>
              <option value="active">Currently Borrowed</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Borrowings List */}
      <div className="space-y-4">
        {filteredBorrowings.length > 0 ? (
          filteredBorrowings.map((borrowing) => {
            const dueDate = getDueDate(borrowing.borrowedAt);
            const daysRemaining = getDaysRemaining(borrowing.borrowedAt);
            const overdue = isOverdue(borrowing.borrowedAt);

            return (
              <div key={borrowing.id} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-primary rounded-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {borrowing.book?.title}
                          </h3>
                          <p className="text-gray-600">by {borrowing.book?.author}</p>
                          {borrowing.book?.publisher && (
                            <p className="text-sm text-gray-500">
                              Published by {borrowing.book.publisher}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {borrowing.returnedAt ? (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm font-medium text-green-600">Returned</span>
                            </div>
                          ) : overdue ? (
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                              <span className="text-sm font-medium text-red-600">Overdue</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Clock className="w-5 h-5 text-yellow-500" />
                              <span className="text-sm font-medium text-yellow-600">
                                {daysRemaining} days left
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="font-medium">Borrowed:</span>
                            <span className="ml-1">
                              {new Date(borrowing.borrowedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="font-medium">Due:</span>
                            <span className={`ml-1 ${overdue ? 'text-red-600' : ''}`}>
                              {dueDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {borrowing.returnedAt && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <div>
                              <span className="font-medium">Returned:</span>
                              <span className="ml-1">
                                {new Date(borrowing.returnedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {overdue && !borrowing.returnedAt && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <div>
                              <p className="font-medium text-red-800">This book is overdue</p>
                              <p className="text-sm text-red-600">
                                Please return it as soon as possible to avoid additional fines.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!borrowing.returnedAt && !overdue && daysRemaining <= 3 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            <div>
                              <p className="font-medium text-yellow-800">Due soon</p>
                              <p className="text-sm text-yellow-600">
                                This book is due in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Return Button */}
                      {!borrowing.returnedAt && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => returnBook(borrowing.id)}
                            className="btn btn-primary btn-sm"
                          >
                            Return Book
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No borrowings found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You haven't borrowed any books yet. Start exploring our collection!"
                : `No ${filter} borrowings found.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {borrowings.length > 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl font-semibold">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {borrowings.length}
                </div>
                <div className="text-sm text-gray-600">Total Borrowings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {borrowings.filter(b => !b.returnedAt).length}
                </div>
                <div className="text-sm text-gray-600">Currently Borrowed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {borrowings.filter(b => !b.returnedAt && !isOverdue(b.borrowedAt)).length}
                </div>
                <div className="text-sm text-gray-600">On Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {borrowings.filter(b => !b.returnedAt && isOverdue(b.borrowedAt)).length}
                </div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBorrowings;

