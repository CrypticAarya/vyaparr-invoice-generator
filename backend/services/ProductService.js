import prisma from '../lib/prisma.js';

class ProductService {
  async getAllForUser(userId) {
    return prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(userId, data) {
    return prisma.product.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async update(id, userId, data) {
    return prisma.product.update({
      where: { id, userId },
      data
    });
  }

  async delete(id, userId) {
    return prisma.product.delete({
      where: { id, userId }
    });
  }

  async getLedger(productId, userId) {
    return prisma.stockTransaction.findMany({
      where: { productId, userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}

export default new ProductService();
