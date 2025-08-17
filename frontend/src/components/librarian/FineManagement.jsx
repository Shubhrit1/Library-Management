import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Calendar, User, BookOpen } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FineManagement = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const response = await axios.get('/api/borrow-records/fines');
      setFines(response.data);
    } catch (error) {
      console.error('Error fetching fines:', error);
      toast.error('Failed to fetch fines');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (fineId) => {
    try {
      await axios.put(`/api/borrow-records/fines/${fineId}`, {
        paid: true,
      });
      toast.success('Fine marked as paid');
      fetchFines();
    } catch (error) {
      console.error('Error updating fine:', error);
      toast.error('Failed to update fine');
    }
  };

  const filteredFines = fines.filter((fine) => {
    const matchesSearch = 
      fine.borrowRecord?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.borrowRecord?.book?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'paid' && fine.paid) ||
      (filter === 'unpaid' && !fine.paid);
    
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
        <h1 className="text-3xl font-bold text-gray-800">Fine Management</h1>
        <p className="text-gray-600 mt-2">Manage library fines and payments</p>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fines..."
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
                <option value="all">All Fines</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
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
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFines.map((fine) => (
                  <tr key={fine.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-10">
                            <span className="text-sm font-semibold">
                              {fine.borrowRecord?.user?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{fine.borrowRecord?.user?.name}</div>
                          <div className="text-sm opacity-50">{fine.borrowRecord?.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold">{fine.borrowRecord?.book?.title}</div>
                          <div className="text-sm opacity-50">by {fine.borrowRecord?.book?.author}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold">${fine.amount.toFixed(2)}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{fine.reason || 'Late return'}</span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(fine.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${fine.paid ? 'badge-success' : 'badge-error'}`}>
                        {fine.paid ? 'Paid' : 'Unpaid'}
                      </div>
                    </td>
                    <td>
                      {!fine.paid && (
                        <button
                          onClick={() => handleMarkPaid(fine.id)}
                          className="btn btn-sm btn-success"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFines.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No fines found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FineManagement;

