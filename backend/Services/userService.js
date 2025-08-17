import prisma from '../DB/db.config.js';

export const getAllUsers = async () => prisma.user.findMany();
export const getUserById = async (id) => prisma.user.findUnique({ where: { id } });
export const createUser = async (data) => prisma.user.create({ data });
export const updateUser = async (id, data) => prisma.user.update({ where: { id }, data });

export const deleteUser = async (id) => {
  try {
    console.log('=== DELETE USER DEBUG ===');
    console.log('Attempting to delete user with ID:', id);
    
    // First, check if user has any active borrow records
    const activeBorrows = await prisma.borrowRecord.findMany({
      where: {
        userId: id,
        returnedAt: null
      }
    });

    console.log('Active borrows found:', activeBorrows.length);

    if (activeBorrows.length > 0) {
      throw new Error(`Cannot delete user: User has ${activeBorrows.length} active borrow records. Please return all books first.`);
    }

    console.log('No active borrows, proceeding with deletion...');

    // Delete user with all related records in a transaction
    return await prisma.$transaction(async (tx) => {
      console.log('Starting transaction...');
      
      // Delete fines associated with user's borrow records
      const deletedFines = await tx.fine.deleteMany({
        where: {
          borrowRecord: {
            userId: id
          }
        }
      });
      console.log('Deleted fines:', deletedFines.count);

      // Delete borrow records
      const deletedBorrows = await tx.borrowRecord.deleteMany({
        where: { userId: id }
      });
      console.log('Deleted borrow records:', deletedBorrows.count);

      // Delete wishlist items
      const deletedWishlist = await tx.wishlist.deleteMany({
        where: { userId: id }
      });
      console.log('Deleted wishlist items:', deletedWishlist.count);

      // Update books created/updated by this user to remove references
      const updatedCreatedBooks = await tx.book.updateMany({
        where: { createdById: id },
        data: { createdById: null }
      });
      console.log('Updated created books:', updatedCreatedBooks.count);

      const updatedUpdatedBooks = await tx.book.updateMany({
        where: { updatedById: id },
        data: { updatedById: null }
      });
      console.log('Updated updated books:', updatedUpdatedBooks.count);

      // Finally delete the user
      const deletedUser = await tx.user.delete({ where: { id } });
      console.log('User deleted successfully:', deletedUser.id);
      
      return deletedUser;
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    if (error.code === 'P2025') {
      throw new Error('User not found');
    }
    throw error;
  }
};

export const getUserByEmail = async (email) => prisma.user.findUnique({ where: { email } });
export const getUserByGoogleId = async (googleId) => prisma.user.findUnique({ where: { googleId } });
export const updateUserRefreshToken = async (id, refreshToken) => 
  prisma.user.update({ where: { id }, data: { refreshToken } });
