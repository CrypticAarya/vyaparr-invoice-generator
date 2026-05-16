import prisma from '../lib/prisma.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * AUDIT LOG CONTROLLER
 * 
 * Provides visibility into system activity.
 */

export const getMyLogs = catchAsync(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;

  const logs = await prisma.auditLog.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit),
    skip: parseInt(skip),
  });

  const total = await prisma.auditLog.count({
    where: { userId: req.user.id }
  });

  res.status(200).json({
    success: true,
    data: {
      logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    }
  });
});
