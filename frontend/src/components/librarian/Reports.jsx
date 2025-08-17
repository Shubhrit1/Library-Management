import React from 'react';
import { BarChart3, BookOpen, Users, FileText, DollarSign } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Library statistics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">1,234</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">567</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Borrowings</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">89</p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Fines</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">$1,234</p>
              </div>
              <div className="p-3 bg-red-500 rounded-full">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl font-semibold">Popular Books</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <div>
                  <p className="font-medium">The Great Gatsby</p>
                  <p className="text-sm text-gray-600">F. Scott Fitzgerald</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">45</p>
                  <p className="text-sm text-gray-600">borrows</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <div>
                  <p className="font-medium">To Kill a Mockingbird</p>
                  <p className="text-sm text-gray-600">Harper Lee</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">38</p>
                  <p className="text-sm text-gray-600">borrows</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <div>
                  <p className="font-medium">1984</p>
                  <p className="text-sm text-gray-600">George Orwell</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">32</p>
                  <p className="text-sm text-gray-600">borrows</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-xl font-semibold">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">New book added</p>
                  <p className="text-sm text-gray-600">The Hobbit by J.R.R. Tolkien</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Book returned</p>
                  <p className="text-sm text-gray-600">The Great Gatsby by John Doe</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Fine issued</p>
                  <p className="text-sm text-gray-600">$5.00 for late return</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl font-semibold">Monthly Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Books Borrowed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">142</div>
              <div className="text-sm text-gray-600">Books Returned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">$89</div>
              <div className="text-sm text-gray-600">Fines Collected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

