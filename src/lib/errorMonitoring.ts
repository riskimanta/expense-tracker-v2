// Error Monitoring Service
// This service provides centralized error tracking and alerting capabilities

export interface ErrorLog {
  id: string
  timestamp: Date
  level: 'info' | 'warn' | 'error' | 'critical'
  message: string
  stack?: string
  context: {
    endpoint?: string
    method?: string
    userId?: string
    userAgent?: string
    ip?: string
    requestBody?: unknown
    responseStatus?: number
    databaseQuery?: string
    executionTime?: number
  }
  tags: string[]
}

export interface ErrorAlert {
  id: string
  timestamp: Date
  level: 'warn' | 'error' | 'critical'
  message: string
  count: number
  lastOccurrence: Date
  isResolved: boolean
  assignedTo?: string
  notes?: string
}

class ErrorMonitoringService {
  private errorLogs: ErrorLog[] = []
  private errorAlerts: ErrorAlert[] = []
  private maxLogs = 1000 // Keep last 1000 errors
  private alertThresholds: Record<'warn' | 'error' | 'critical', number> = {
    warn: 5,    // Alert after 5 warnings
    error: 3,   // Alert after 3 errors
    critical: 1 // Alert immediately for critical errors
  }

  // Log an error
  logError(
    level: ErrorLog['level'],
    message: string,
    error?: Error,
    context: Partial<ErrorLog['context']> = {}
  ): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      message,
      stack: error?.stack,
      context: {
        ...context,
        executionTime: context.executionTime || 0
      },
      tags: this.extractTags(message, context)
    }

    this.errorLogs.push(errorLog)
    
    // Keep only the last maxLogs
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogs)
    }

    // Check if we should create an alert
    this.checkForAlerts(errorLog)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${level.toUpperCase()}: ${message}`)
      console.log('Context:', context)
      if (error?.stack) {
        console.log('Stack:', error.stack)
      }
      console.groupEnd()
    }

    // Send to external monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorLog)
    }
  }

  // Log API errors
  logApiError(
    endpoint: string,
    method: string,
    status: number,
    message: string,
    requestBody?: unknown,
    executionTime?: number
  ): void {
    const level = this.getErrorLevel(status)
    
    this.logError(level, `API Error: ${message}`, undefined, {
      endpoint,
      method,
      responseStatus: status,
      requestBody,
      executionTime
    })
  }

  // Log database errors
  logDatabaseError(
    query: string,
    error: Error,
    executionTime?: number
  ): void {
    this.logError('error', `Database Error: ${error.message}`, error, {
      databaseQuery: query,
      executionTime
    })
  }

  // Log business logic conflicts
  logBusinessConflict(
    entity: string,
    action: string,
    reason: string,
    context: Record<string, unknown> = {}
  ): void {
    this.logError('warn', `Business Conflict: Cannot ${action} ${entity} - ${reason}`, undefined, {
      ...context
    })
  }

  // Get error level based on HTTP status
  private getErrorLevel(status: number): ErrorLog['level'] {
    if (status >= 500) return 'critical'
    if (status >= 400) return 'error'
    if (status >= 300) return 'warn'
    return 'info'
  }

  // Extract tags from error message and context
  private extractTags(message: string, context: Record<string, unknown>): string[] {
    const tags: string[] = []
    
    // Extract entity type from message
    if (message.includes('account')) tags.push('accounts')
    if (message.includes('user')) tags.push('users')
    if (message.includes('transaction')) tags.push('transactions')
    if (message.includes('category')) tags.push('categories')
    
    // Extract error type
    if (message.includes('database')) tags.push('database')
    if (message.includes('validation')) tags.push('validation')
    if (message.includes('conflict')) tags.push('conflict')
    if (message.includes('not found')) tags.push('not-found')
    
    // Add context-based tags
    if (context.endpoint) tags.push(`endpoint:${context.endpoint}`)
    if (context.method) tags.push(`method:${context.method}`)
    
    return tags
  }

  // Check if we should create an alert
  private checkForAlerts(errorLog: ErrorLog): void {
    // Only create alerts for warn, error, and critical levels
    if (errorLog.level === 'info') return
    
    const threshold = this.alertThresholds[errorLog.level as 'warn' | 'error' | 'critical']
    if (!threshold) return

    // Count recent errors of the same level and message
    const recentErrors = this.errorLogs.filter(log => 
      log.level === errorLog.level &&
      log.message === errorLog.message &&
      Date.now() - log.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    )

    if (recentErrors.length >= threshold) {
      this.createAlert(errorLog, recentErrors.length)
    }
  }

  // Create an alert
  private createAlert(errorLog: ErrorLog, count: number): void {
    // Only create alerts for warn, error, and critical levels
    if (errorLog.level === 'info') return
    
    const existingAlert = this.errorAlerts.find(alert => 
      alert.message === errorLog.message && !alert.isResolved
    )

    if (existingAlert) {
      // Update existing alert
      existingAlert.count = count
      existingAlert.lastOccurrence = errorLog.timestamp
    } else {
      // Create new alert
      const alert: ErrorAlert = {
        id: this.generateId(),
        timestamp: errorLog.timestamp,
        level: errorLog.level as 'warn' | 'error' | 'critical',
        message: errorLog.message,
        count,
        lastOccurrence: errorLog.timestamp,
        isResolved: false
      }
      this.errorAlerts.push(alert)
    }
  }

  // Get all error logs
  getErrorLogs(limit: number = 100): ErrorLog[] {
    return this.errorLogs.slice(-limit).reverse()
  }

  // Get all alerts
  getAlerts(): ErrorAlert[] {
    return this.errorAlerts.filter(alert => !alert.isResolved)
  }

  // Resolve an alert
  resolveAlert(alertId: string, notes?: string): void {
    const alert = this.errorAlerts.find(a => a.id === alertId)
    if (alert) {
      alert.isResolved = true
      alert.notes = notes
    }
  }

  // Get error statistics
  getErrorStats(): {
    total: number
    byLevel: Record<string, number>
    byTag: Record<string, number>
    recentErrors: number
  } {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000

    const byLevel = this.errorLogs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byTag = this.errorLogs.reduce((acc, log) => {
      log.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    const recentErrors = this.errorLogs.filter(log => 
      log.timestamp.getTime() > oneHourAgo
    ).length

    return {
      total: this.errorLogs.length,
      byLevel,
      byTag,
      recentErrors
    }
  }

  // Clear old logs
  clearOldLogs(olderThanDays: number = 7): void {
    const cutoff = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000)
    this.errorLogs = this.errorLogs.filter(log => 
      log.timestamp.getTime() > cutoff
    )
  }

  // Send to external monitoring service (placeholder)
  private sendToExternalService(errorLog: ErrorLog): void {
    // In production, this would send to services like:
    // - Sentry
    // - LogRocket
    // - DataDog
    // - New Relic
    
    if (process.env.SENTRY_DSN) {
      // Example Sentry integration
      console.log('Sending to Sentry:', errorLog.message)
    }
    
    if (process.env.DATADOG_API_KEY) {
      // Example DataDog integration
      console.log('Sending to DataDog:', errorLog.message)
    }
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

// Export singleton instance
export const errorMonitoring = new ErrorMonitoringService()

// Convenience functions
export const logError = (level: ErrorLog['level'], message: string, error?: Error, context?: Record<string, unknown>) => {
  errorMonitoring.logError(level, message, error, context)
}

export const logApiError = (endpoint: string, method: string, status: number, message: string, requestBody?: unknown, executionTime?: number) => {
  errorMonitoring.logApiError(endpoint, method, status, message, requestBody, executionTime)
}

export const logDatabaseError = (query: string, error: Error, executionTime?: number) => {
  errorMonitoring.logDatabaseError(query, error, executionTime)
}

export const logBusinessConflict = (entity: string, action: string, reason: string, context?: Record<string, unknown>) => {
  errorMonitoring.logBusinessConflict(entity, action, reason, context)
}
