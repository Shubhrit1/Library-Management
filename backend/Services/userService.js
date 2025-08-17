import prisma from '../DB/db.config.js';

export const getAllUsers = async () => prisma.user.findMany();
export const getUserById = async (id) => prisma.user.findUnique({ where: { id } });
export const createUser = async (data) => prisma.user.create({ data });
export const updateUser = async (id, data) => prisma.user.update({ where: { id }, data });
export const deleteUser = async (id) => prisma.user.delete({ where: { id } });
export const getUserByEmail = async (email) => prisma.user.findUnique({ where: { email } });
export const getUserByGoogleId = async (googleId) => prisma.user.findUnique({ where: { googleId } });
export const updateUserRefreshToken = async (id, refreshToken) => 
  prisma.user.update({ where: { id }, data: { refreshToken } });
