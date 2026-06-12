import bcrypt from 'bcryptjs';

/**
 * Verifies if the provided password matches the stored hash.
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('[AUTH] Password verification error:', error);
    return false;
  }
};
