import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Calendar, Shield, Edit, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the user profile
      // await axios.put(`/api/users/${user.id}`, formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title text-xl font-semibold">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="btn btn-primary btn-sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn btn-outline btn-sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-16">
                      <span className="text-2xl font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name}</h3>
                    <p className="text-gray-600">Library Member</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Full Name</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        className="input input-bordered"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-base-200 rounded-lg">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{user?.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        className="input input-bordered"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-base-200 rounded-lg">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user?.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Member Since</span>
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-base-200 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Role</span>
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-base-200 rounded-lg">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">{user?.role?.toLowerCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-lg font-semibold">Account Status</h2>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account Status</span>
                  <div className="badge badge-success">Active</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verified</span>
                  <div className="badge badge-success">Yes</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Login</span>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-lg font-semibold">Quick Stats</h2>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Books Borrowed</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Currently Borrowed</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overdue Books</span>
                  <span className="font-semibold text-red-600">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Outstanding Fines</span>
                  <span className="font-semibold">$0.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-lg font-semibold">Actions</h2>
              <div className="space-y-3 mt-4">
                <button className="btn btn-outline w-full">
                  Change Password
                </button>
                <button className="btn btn-outline w-full">
                  Download Reading History
                </button>
                <button className="btn btn-outline w-full">
                  Privacy Settings
                </button>
                <button className="btn btn-error w-full">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

