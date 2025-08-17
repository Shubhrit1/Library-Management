import * as userService from '../Services/userService.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, name, passwordHash } = req.body;

    if (!email || !name || !passwordHash) {
      return res.status(400).json({ error: 'Missing required fields: email, name, passwordHash' });
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email) {
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const updatedUser = await userService.updateUser(id, req.body);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log('=== DELETE USER CONTROLLER DEBUG ===');
    const { id } = req.params;
    console.log('User ID to delete:', id);
    console.log('Request user:', req.user);
    
    // Check if user exists
    const user = await userService.getUserById(id);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if trying to delete self (librarian/admin)
    if (req.user && req.user.id === id) {
      console.log('Attempting to delete self - blocked');
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if trying to delete another admin/librarian (only admin should be able to do this)
    if (user.role === 'ADMIN' && req.user.role !== 'ADMIN') {
      console.log('Attempting to delete admin without admin privileges - blocked');
      return res.status(403).json({ error: 'Only administrators can delete admin accounts' });
    }

    // Check if librarian is trying to delete another librarian (only admin should be able to do this)
    if (user.role === 'LIBRARIAN' && req.user.role === 'LIBRARIAN' && req.user.id !== id) {
      console.log('Librarian attempting to delete another librarian - blocked');
      return res.status(403).json({ error: 'Only administrators can delete librarian accounts' });
    }

    console.log('Proceeding with user deletion...');
    await userService.deleteUser(id);
    console.log('User deletion completed successfully');
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    console.error('Full error:', error);
    
    if (error.message.includes('active borrow records')) {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Failed to delete user. Please try again.' });
  }
};

export const updateRefreshToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { refreshToken } = req.body;

    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await userService.updateUserRefreshToken(id, refreshToken);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating refresh token:', error.message);
    res.status(500).json({ error: 'Failed to update refresh token' });
  }
};
