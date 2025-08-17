import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userService from '../services/userService.js';
import { generateTokens } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await userService.createUser({
      name,
      email,
      passwordHash,
      role: 'MEMBER' // Default role
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Update user with refresh token
    await userService.updateUserRefreshToken(user.id, refreshToken);

    // Remove password from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user has password (not OAuth only)
    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Please use OAuth login' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Update user with refresh token
    await userService.updateUserRefreshToken(user.id, refreshToken);

    // Remove password from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user and check if refresh token matches
    const user = await userService.getUserById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

    // Update user with new refresh token
    await userService.updateUserRefreshToken(user.id, newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    console.error('Token refresh error:', error.message);
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Clear refresh token
    await userService.updateUserRefreshToken(userId, null);
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data
    const { passwordHash: _, refreshToken: __, ...userProfile } = user;
    
    res.json(userProfile);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};
