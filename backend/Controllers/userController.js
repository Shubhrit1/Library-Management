import * as userService from '../services/userService.js';

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
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Failed to delete user' });
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
