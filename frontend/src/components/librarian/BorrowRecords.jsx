import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, BookOpen } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BorrowRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get('/api/borrow-records');
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to fetch borrow records');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (recordId) => {
    try {
      await axios.put(`/api/borrow-records/${recordId}`, {
        returnedAt: new Date().toISOString(),
      });
      toast.success('Book returned successfully');
      fetchRecords();
    } catch (error) {
      console.error('Error returning book:', error);
      toast.error('Failed to return book');
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch = 
      record.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.book?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'active' && !record.returnedAt) ||
      (filter === 'returned' && record.returnedAt);
    
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
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Borrow Records</h1>
        <p className="text-gray-600 mt-2">Manage book borrowing and returns</p>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
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
                <option value="all">All Records</option>
                <option value="active">Active</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Borrowed</th>
                  <th>Returned</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-10">
                            <span className="text-sm font-semibold">
                              {record.user?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{record.user?.name}</div>
                          <div className="text-sm opacity-50">{record.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold">{record.book?.title}</div>
                          <div className="text-sm opacity-50">by {record.book?.author}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(record.borrowedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      {record.returnedAt ? (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-400" />
                          <span className="text-sm">
                            {new Date(record.returnedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not returned</span>
                      )}
                    </td>
                    <td>
                      <div className={`badge ${record.returnedAt ? 'badge-success' : 'badge-warning'}`}>
                        {record.returnedAt ? 'Returned' : 'Active'}
                      </div>
                    </td>
                    <td>
                      {!record.returnedAt && (
                        <button
                          onClick={() => handleReturn(record.id)}
                          className="btn btn-sm btn-success"
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowRecords;

