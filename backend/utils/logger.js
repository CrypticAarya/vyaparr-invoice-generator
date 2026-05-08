/**
 * Simple production-grade security logger.
 * In a real SaaS, this would send logs to a service like Datadog, ELK, or CloudWatch.
 */
class SecurityLogger {
  log(event, details = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      ...details,
      severity: this.getSeverity(event)
    };

    // For now, we log to console in a structured JSON format
    console.log(`[SECURITY_AUDIT] ${JSON.stringify(logEntry)}`);
  }

  getSeverity(event) {
    const criticalEvents = ['PASSWORD_RESET_SUCCESS', 'LOGIN_FAILURE_REPEATED', 'ADMIN_ACTION'];
    if (criticalEvents.includes(event)) return 'CRITICAL';
    
    const warningEvents = ['LOGIN_FAILURE', 'TOKEN_REFRESH_FAILURE', 'UNAUTHORIZED_ACCESS_ATTEMPT'];
    if (warningEvents.includes(event)) return 'WARNING';

    return 'INFO';
  }
}

export default new SecurityLogger();
