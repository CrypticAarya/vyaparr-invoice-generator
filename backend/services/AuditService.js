import prisma from '../lib/prisma.js';
import logger from '../utils/LoggerService.js';

/**
 * AUDIT SERVICE
 * 
 * Records critical user actions and system changes to the database.
 * This is essential for SaaS transparency, security auditing, and compliance.
 */
class AuditService {
  
  /**
   * Record an action in the audit log.
   */
  async log(userId, action, entity = null, entityId = null, details = {}, req = null) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          details: details || {},
          ipAddress: req?.ip || null,
          userAgent: req?.get('user-agent') || null,
        }
      });

      logger.info(`Audit Log: [${action}] by User [${userId || 'SYSTEM'}] on Entity [${entity || 'N/A'}]`);
    } catch (error) {
      // We don't want audit logging failures to crash the main request flow,
      // but we MUST log the failure for investigation.
      logger.error(`Failed to create audit log for action ${action}:`, error);
    }
  }

  /**
   * Helper for sensitive security events.
   */
  async security(userId, action, details = {}, req = null) {
    return this.log(userId, `SECURITY_${action}`, 'SECURITY', null, details, req);
  }
}

export default new AuditService();
