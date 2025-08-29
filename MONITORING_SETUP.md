# Monitoring Setup Guide

## Overview
This guide explains how to set up and configure the error monitoring and alerting system for the Expense Tracker application.

## Features

### 1. Error Tracking
- **Real-time Error Logging**: All errors are logged with context and metadata
- **Error Classification**: Errors are categorized by severity (info, warn, error, critical)
- **Context Preservation**: Request details, database queries, and execution times are captured
- **Tag-based Organization**: Automatic tagging for easy filtering and analysis

### 2. Alerting System
- **Threshold-based Alerts**: Automatic alerts when error thresholds are exceeded
- **Real-time Notifications**: Immediate alerts for critical errors
- **Alert Management**: Resolve and track alert status
- **Escalation Rules**: Different thresholds for different error levels

### 3. Dashboard & Analytics
- **Real-time Statistics**: Live error counts and system health metrics
- **Visual Indicators**: Color-coded error levels and status indicators
- **Historical Data**: Error trends and patterns over time
- **Performance Metrics**: Response times and execution performance

## Configuration

### Environment Variables

Add these variables to your `.env.local` file:

```bash
# Error Monitoring
NODE_ENV=development
ENABLE_ERROR_MONITORING=true
ERROR_LOG_RETENTION_DAYS=7
MAX_ERROR_LOGS=1000

# External Monitoring Services (Optional)
SENTRY_DSN=your_sentry_dsn_here
DATADOG_API_KEY=your_datadog_api_key_here
LOGROCKET_APP_ID=your_logrocket_app_id_here

# Alert Thresholds
WARN_ALERT_THRESHOLD=5
ERROR_ALERT_THRESHOLD=3
CRITICAL_ALERT_THRESHOLD=1
ALERT_TIME_WINDOW_MINUTES=5
```

### Alert Thresholds

| Error Level | Default Threshold | Description |
|-------------|-------------------|-------------|
| **Warn** | 5 occurrences | Alert after 5 warnings in 5 minutes |
| **Error** | 3 occurrences | Alert after 3 errors in 5 minutes |
| **Critical** | 1 occurrence | Alert immediately for critical errors |

## Usage

### 1. Basic Error Logging

```typescript
import { logError, logApiError, logDatabaseError } from '@/lib/errorMonitoring'

// Log general errors
logError('error', 'Something went wrong', error, { userId: '123' })

// Log API errors
logApiError('/api/users', 'POST', 500, 'Failed to create user', requestBody, 150)

// Log database errors
logDatabaseError('SELECT * FROM users', error, 200)
```

### 2. Business Logic Conflicts

```typescript
import { logBusinessConflict } from '@/lib/errorMonitoring'

// Log business rule violations
logBusinessConflict('user', 'delete', 'has active accounts', {
  userId: '123',
  accountCount: 2
})
```

### 3. Accessing Monitoring Data

```typescript
import { errorMonitoring } from '@/lib/errorMonitoring'

// Get error statistics
const stats = errorMonitoring.getErrorStats()

// Get recent error logs
const logs = errorMonitoring.getErrorLogs(100)

// Get active alerts
const alerts = errorMonitoring.getAlerts()

// Resolve an alert
errorMonitoring.resolveAlert('alert-id', 'Fixed by updating validation')
```

## Admin Dashboard

### Access Path
```
/admin/monitoring
```

### Features
- **Statistics Tab**: Overview of system health and error metrics
- **Alerts Tab**: Active alerts requiring attention
- **Logs Tab**: Detailed error logs with context and stack traces

### Real-time Updates
- Auto-refresh every 30 seconds
- Live error count updates
- Real-time alert notifications

## Integration with External Services

### Sentry Integration
```typescript
// Automatic integration when SENTRY_DSN is set
if (process.env.SENTRY_DSN) {
  // Errors are automatically sent to Sentry
  console.log('Sending to Sentry:', errorLog.message)
}
```

### DataDog Integration
```typescript
// Automatic integration when DATADOG_API_KEY is set
if (process.env.DATADOG_API_KEY) {
  // Errors are automatically sent to DataDog
  console.log('Sending to DataDog:', errorLog.message)
}
```

### Custom Integration
```typescript
// Add your own monitoring service
private sendToExternalService(errorLog: ErrorLog): void {
  if (process.env.CUSTOM_MONITORING_URL) {
    fetch(process.env.CUSTOM_MONITORING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorLog)
    })
  }
}
```

## Best Practices

### 1. Error Context
Always provide meaningful context when logging errors:
```typescript
logError('error', 'User creation failed', error, {
  endpoint: '/api/users',
  method: 'POST',
  requestBody: { name: 'John', email: 'john@example.com' },
  userId: '123'
})
```

### 2. Business Logic Logging
Log business conflicts for better understanding:
```typescript
logBusinessConflict('account', 'delete', 'insufficient balance', {
  accountId: '456',
  currentBalance: 1000,
  requiredBalance: 5000
})
```

### 3. Performance Monitoring
Track execution times for performance analysis:
```typescript
const startTime = Date.now()
try {
  // ... operation
} finally {
  const executionTime = Date.now() - startTime
  logError('info', 'Operation completed', undefined, { executionTime })
}
```

## Maintenance

### 1. Log Rotation
- Automatic cleanup of old logs (configurable retention period)
- Memory-efficient storage with configurable limits
- Manual cleanup via admin dashboard

### 2. Alert Resolution
- Mark alerts as resolved when issues are fixed
- Add notes for future reference
- Track resolution time and assignee

### 3. Performance Optimization
- Efficient error storage and retrieval
- Minimal impact on application performance
- Configurable log limits and retention

## Troubleshooting

### Common Issues

1. **High Memory Usage**
   - Reduce `MAX_ERROR_LOGS` value
   - Decrease `ERROR_LOG_RETENTION_DAYS`
   - Clear old logs manually

2. **Too Many Alerts**
   - Increase alert thresholds
   - Extend alert time window
   - Review error patterns

3. **External Service Integration**
   - Verify API keys and DSNs
   - Check network connectivity
   - Review service quotas

### Debug Mode
Enable debug logging in development:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.group(`🚨 ${level.toUpperCase()}: ${message}`)
  console.log('Context:', context)
  if (error?.stack) {
    console.log('Stack:', error.stack)
  }
  console.groupEnd()
}
```

## Security Considerations

### 1. Sensitive Data
- Never log passwords, tokens, or sensitive user data
- Sanitize request bodies before logging
- Use environment-specific logging levels

### 2. Access Control
- Admin dashboard requires admin privileges
- Error logs contain potentially sensitive information
- Implement proper authentication and authorization

### 3. Data Retention
- Configure appropriate retention periods
- Comply with data protection regulations
- Regular cleanup of old logs

## Future Enhancements

### Planned Features
- **Email Notifications**: Send alerts via email
- **Slack Integration**: Post alerts to Slack channels
- **Metrics Dashboard**: Advanced analytics and reporting
- **Custom Alert Rules**: User-defined alert conditions
- **Error Correlation**: Group related errors together
- **Performance Baselines**: Automatic performance monitoring

### Customization
- **Custom Error Types**: Define application-specific error categories
- **Alert Channels**: Multiple notification methods
- **Error Aggregation**: Group similar errors for better analysis
- **Custom Metrics**: Track application-specific metrics
