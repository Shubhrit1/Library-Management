import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Heart, Trash2, Calendar, User } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('/api/wishlist/my');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      if (!window.confirm('Are you sure you want to remove this book from your wishlist?')) {
        return;
      }
      
      await axios.delete(`/api/wishlist/remove/${bookId}`);
      toast.success('Removed from wishlist');
      fetchWishlist(); // Refresh the list
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      const errorMessage = error.response?.data?.error || 'Failed to remove from wishlist';
      toast.error(errorMessage);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
        <p className="text-gray-600 mt-2">Books you want to read</p>
      </div>

      {/* Wishlist Items */}
      <div className="space-y-4">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow-lg">
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
                          {item.book.title}
                        </h3>
                        <p className="text-gray-600">by {item.book.author}</p>
                        {item.book.publisher && (
                          <p className="text-sm text-gray-500 mt-1">
                            Published by {item.book.publisher}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-medium text-red-600">In Wishlist</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                      {item.book.isbn && (
                        <div>
                          <span className="font-medium">ISBN:</span>
                          <span className="ml-2">{item.book.isbn}</span>
                        </div>
                      )}
                      {item.book.publishedYear && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="font-medium">Published:</span>
                            <span className="ml-2">{item.book.publishedYear}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="font-medium">Available:</span>
                          <span className={`ml-2 ${item.book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.book.availableCopies > 0 ? `${item.book.availableCopies} copies` : 'Out of stock'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <div className="flex-1">
                            <p className="font-medium text-blue-800">Notes:</p>
                            <p className="text-sm text-blue-600">{item.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500">
                        Added on {new Date(item.addedAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => removeFromWishlist(item.book.id)}
                          className="btn btn-error btn-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600">
              Start adding books to your wishlist from the Book Catalog!
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {wishlist.length > 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl font-semibold">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {wishlist.length}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {wishlist.filter(item => item.book.availableCopies > 0).length}
                </div>
                <div className="text-sm text-gray-600">Available Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {wishlist.filter(item => item.book.availableCopies === 0).length}
                </div>
                <div className="text-sm text-gray-600">Out of Stock</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist; 