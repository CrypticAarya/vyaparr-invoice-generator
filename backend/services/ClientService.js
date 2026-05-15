import prisma from '../lib/prisma.js';

class ClientService {
  async getAllForUser(userId) {
    return prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(userId, data) {
    return prisma.client.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async update(id, userId, data) {
    return prisma.client.update({
      where: { id, userId },
      data
    });
  }

  async delete(id, userId) {
    return prisma.client.delete({
      where: { id, userId }
    });
  }
}

export default new ClientService();
