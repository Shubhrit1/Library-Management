import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Calendar, User, Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const BookCatalog = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    // Check wishlist status for all books when books are loaded
    if (books.length > 0 && user) {
      checkWishlistStatusForBooks();
    }
  }, [books, user]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data.books || response.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatusForBooks = async () => {
    try {
      const statusPromises = books.map(async (book) => {
        try {
          const response = await axios.get(`/api/wishlist/check/${book.id}`);
          return { bookId: book.id, inWishlist: response.data.inWishlist };
        } catch (error) {
          return { bookId: book.id, inWishlist: false };
        }
      });
      
      const statuses = await Promise.all(statusPromises);
      const statusMap = {};
      statuses.forEach(status => {
        statusMap[status.bookId] = status.inWishlist;
      });
      setWishlistStatus(statusMap);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async (bookId) => {
    try {
      if (wishlistStatus[bookId]) {
        // Remove from wishlist
        await axios.delete(`/api/wishlist/remove/${bookId}`);
        setWishlistStatus(prev => ({ ...prev, [bookId]: false }));
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await axios.post('/api/wishlist/add', { bookId });
        setWishlistStatus(prev => ({ ...prev, [bookId]: true }));
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update wishlist';
      toast.error(errorMessage);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      if (!user) {
        toast.error('Please log in to borrow books');
        return;
      }

      console.log('=== BORROW DEBUG ===');
      console.log('Book ID being sent:', bookId);
      console.log('Book ID type:', typeof bookId);
      console.log('User:', user);

      await axios.post('/api/borrow-records', {
        bookId,
      });
      toast.success('Book borrowed successfully!');
      fetchBooks(); // Refresh to update availability
    } catch (error) {
      console.error('Error borrowing book:', error);
      const errorMessage = error.response?.data?.error || 'Failed to borrow book';
      toast.error(errorMessage);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.isbn && book.isbn.includes(searchTerm));
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'available' && book.availableCopies > 0) ||
                         (filter === 'unavailable' && book.availableCopies === 0);
    
    return matchesSearch && matchesFilter;
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
        <h1 className="text-3xl font-bold text-gray-800">Book Catalog</h1>
        <p className="text-gray-600 mt-2">Explore our collection of books</p>
      </div>

      {/* Search and Filter */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="select select-bordered"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Books</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="card bg-base-100 shadow-lg card-hover">
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setShowBookModal(true);
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  <span className="sr-only">View details</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <h3 className="card-title text-lg font-semibold line-clamp-2">{book.title}</h3>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                {book.publisher && (
                  <div className="flex items-center">
                    <span className="font-medium">Publisher:</span>
                    <span className="ml-2">{book.publisher}</span>
                  </div>
                )}
                {book.publishedYear && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{book.publishedYear}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">
                    {book.availableCopies} available
                  </span>
                </div>
                <div className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-error'}`}>
                  {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                {book.availableCopies > 0 ? (
                  <button
                    onClick={() => handleBorrow(book.id)}
                    className="btn btn-primary btn-sm"
                  >
                    Borrow
                  </button>
                ) : (
                  <button className="btn btn-disabled btn-sm">
                    Unavailable
                  </button>
                )}
                <button 
                  onClick={() => toggleWishlist(book.id)}
                  className="btn btn-ghost btn-sm"
                >
                  <Heart className={`w-4 h-4 ${wishlistStatus[book.id] ? 'text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Book Details Modal */}
      {showBookModal && selectedBook && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">{selectedBook.title}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-4 bg-primary rounded-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold">{selectedBook.title}</h4>
                  <p className="text-gray-600">by {selectedBook.author}</p>
                  {selectedBook.publisher && (
                    <p className="text-sm text-gray-500 mt-1">
                      Published by {selectedBook.publisher}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedBook.isbn && (
                  <div>
                    <span className="font-medium">ISBN:</span>
                    <span className="ml-2">{selectedBook.isbn}</span>
                  </div>
                )}
                {selectedBook.publishedYear && (
                  <div>
                    <span className="font-medium">Published:</span>
                    <span className="ml-2">{selectedBook.publishedYear}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Available Copies:</span>
                  <span className="ml-2">{selectedBook.availableCopies}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 badge badge-sm ${
                    selectedBook.availableCopies > 0 ? 'badge-success' : 'badge-error'
                  }`}>
                    {selectedBook.availableCopies > 0 ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                {selectedBook.availableCopies > 0 ? (
                  <button
                    onClick={() => {
                      handleBorrow(selectedBook.id);
                      setShowBookModal(false);
                    }}
                    className="btn btn-primary"
                  >
                    Borrow This Book
                  </button>
                ) : (
                  <button className="btn btn-disabled">
                    Currently Unavailable
                  </button>
                )}
                <button 
                  onClick={() => toggleWishlist(selectedBook.id)}
                  className="btn btn-outline"
                >
                  <Heart className={`w-4 h-4 mr-2 ${wishlistStatus[selectedBook.id] ? 'text-red-500' : 'text-gray-400'}`} />
                  {wishlistStatus[selectedBook.id] ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowBookModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCatalog;

