import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  BookOpen,
  Calendar,
  User,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    publishedYear: '',
    availableCopies: 1,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

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

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/books', formData);
      toast.success('Book added successfully');
      setShowAddModal(false);
      setFormData({
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        publishedYear: '',
        availableCopies: 1,
      });
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Failed to add book');
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/books/${selectedBook.id}`, formData);
      toast.success('Book updated successfully');
      setShowEditModal(false);
      setSelectedBook(null);
      setFormData({
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        publishedYear: '',
        availableCopies: 1,
      });
      fetchBooks();
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update book');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${bookId}`);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
      }
    }
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher || '',
      isbn: book.isbn || '',
      publishedYear: book.publishedYear || '',
      availableCopies: book.availableCopies,
    });
    setShowEditModal(true);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Book Management</h1>
          <p className="text-gray-600 mt-2">Manage your library's book collection</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Book
        </button>
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
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
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
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-sm">
                    <span className="sr-only">Options</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <button onClick={() => openEditModal(book)}>
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleDeleteBook(book.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
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
                {book.isbn && (
                  <div className="flex items-center">
                    <span className="font-medium">ISBN:</span>
                    <span className="ml-2">{book.isbn}</span>
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

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add New Book</h3>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Author *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Publisher</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">ISBN</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Published Year</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.publishedYear}
                    onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Available Copies</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.availableCopies}
                    onChange={(e) => setFormData({ ...formData, availableCopies: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Book</h3>
            <form onSubmit={handleEditBook} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Author *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Publisher</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">ISBN</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Published Year</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.publishedYear}
                    onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Available Copies</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.availableCopies}
                    onChange={(e) => setFormData({ ...formData, availableCopies: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;

