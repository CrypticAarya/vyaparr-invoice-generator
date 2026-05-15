import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * USER SERVICE
 * 
 * Manages identity and security logic. We isolate hashing and sensitive 
 * token generation here to keep our controllers lean and focused.
 */
class UserService {

  async createUser(details) {
    // Hash the password before it ever touches the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(details.password, salt);
    
    return prisma.user.create({
      data: {
        ...details,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * SESSION MANAGEMENT: Updates the encrypted refresh token.
   * This is part of our secure httpOnly cookie strategy.
   */
  async updateRefreshToken(userId, token) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }

  async updateProfile(userId, profileData) {
    return prisma.user.update({
      where: { id: userId },
      data: profileData
    });
  }

  /**
   * SECURITY TOKENS: Handles lookup for Password Reset and Email Verification.
   * We ensure tokens are both valid and not expired.
   */
  async findByResetToken(hashedToken) {
    return prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() }
      }
    });
  }

  async findByVerificationToken(hashedToken) {
    return prisma.user.findFirst({
      where: {
        verificationToken: hashedToken,
        verificationExpires: { gt: new Date() }
      }
    });
  }

  /**
   * GENERATE SECURE TOKEN
   * Creates a random hex token, hashes it for DB storage, and returns 
   * the raw version to be sent to the user (via email or response).
   */
  async generateSecureToken(userId, purpose = 'passwordReset') {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour validity

    const fieldsToUpdate = purpose === 'passwordReset' 
      ? { passwordResetToken: hashedToken, passwordResetExpires: expiryDate }
      : { verificationToken: hashedToken, verificationExpires: expiryDate };

    await prisma.user.update({
      where: { id: userId },
      data: fieldsToUpdate
    });

    return rawToken;
  }

  async verifyPassword(user, attempt) {
    return bcrypt.compare(attempt, user.password);
  }
}

export default new UserService();
