"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, AlertCircle, Info, XCircle, CheckCircle, Clock, Tag } from 'lucide-react'
import { errorMonitoring, ErrorLog, ErrorAlert } from '@/lib/errorMonitoring'

export default function MonitoringPage() {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([])
  const [alerts, setAlerts] = useState<ErrorAlert[]>([])
  const [stats, setStats] = useState<{
    total: number
    byLevel: Record<string, number>
    byTag: Record<string, number>
    recentErrors: number
  } | null>(null)
  const [activeTab, setActiveTab] = useState<'logs' | 'alerts' | 'stats'>('stats')

  useEffect(() => {
    refreshData()
    // Refresh every 30 seconds
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setErrorLogs(errorMonitoring.getErrorLogs(100))
    setAlerts(errorMonitoring.getAlerts())
    setStats(errorMonitoring.getErrorStats())
  }

  const resolveAlert = (alertId: string) => {
    errorMonitoring.resolveAlert(alertId, 'Resolved by admin')
    refreshData()
  }

  const clearOldLogs = () => {
    errorMonitoring.clearOldLogs(7)
    refreshData()
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'error':
        return 'bg-red-50 text-red-700 border-red-100'
      case 'warn':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100'
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-100'
      default:
        return 'bg-[color:var(--muted-bg)] text-[color:var(--txt-2)] border-[color:var(--border)]'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[color:var(--txt-1)]">System Monitoring</h1>
          <p className="text-[var(--txt-med)] mt-1">Monitor system health and error tracking</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshData} variant="outline">
            Refresh
          </Button>
          <Button onClick={clearOldLogs} variant="outline">
            Clear Old Logs
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-[color:var(--surface-2)] p-1 rounded-lg">
        <Button
          variant={activeTab === 'stats' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </Button>
        <Button
          variant={activeTab === 'alerts' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('alerts')}
        >
          Alerts ({alerts.length})
        </Button>
        <Button
          variant={activeTab === 'logs' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('logs')}
        >
          Error Logs ({errorLogs.length})
        </Button>
      </div>

      {/* Statistics Tab */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
              <XCircle className="h-4 w-4 text-[color:var(--txt-2)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-[color:var(--txt-2)]">
                {stats.recentErrors} in last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Errors</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.byLevel.critical || 0}
              </div>
              <p className="text-xs text-[color:var(--txt-2)]">
                Immediate attention required
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {alerts.length}
              </div>
              <p className="text-xs text-[color:var(--txt-2)]">
                Require investigation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.total === 0 ? '100%' : 
                  Math.max(0, Math.round(100 - (stats.byLevel.critical || 0) * 10)) + '%'}
              </div>
              <p className="text-xs text-[color:var(--txt-2)]">
                Based on error severity
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                <p className="text-[color:var(--txt-2)]">
                  All systems are running smoothly!
                </p>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getLevelIcon(alert.level)}
                        <Badge variant="outline" className={getLevelColor(alert.level)}>
                          {alert.level.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-[color:var(--txt-2)]">
                          Count: {alert.count}
                        </span>
                      </div>
                      <p className="font-medium mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-sm text-[color:var(--txt-2)]">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.lastOccurrence.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {alert.count} occurrences
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Error Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {errorLogs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Error Logs</h3>
                <p className="text-[color:var(--txt-2)]">
                  System is running without errors!
                </p>
              </CardContent>
            </Card>
          ) : (
            errorLogs.map((log) => (
              <Card key={log.id} className="border-l-4 border-l-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getLevelIcon(log.level)}
                        <Badge variant="outline" className={getLevelColor(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-[color:var(--txt-2)]">
                          {log.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="font-medium mb-2">{log.message}</p>
                      
                      {/* Context Information */}
                      {Object.keys(log.context).length > 0 && (
                        <div className="bg-[color:var(--surface-2)] p-3 rounded-md mb-2">
                          <h4 className="text-sm font-medium mb-2">Context:</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {log.context.endpoint && (
                              <div><strong>Endpoint:</strong> {log.context.endpoint}</div>
                            )}
                            {log.context.method && (
                              <div><strong>Method:</strong> {log.context.method}</div>
                            )}
                            {log.context.responseStatus && (
                              <div><strong>Status:</strong> {log.context.responseStatus}</div>
                            )}
                            {log.context.executionTime && (
                              <div><strong>Time:</strong> {log.context.executionTime}ms</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {log.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {log.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Stack Trace */}
                      {log.stack && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-[color:var(--txt-2)]">
                            Stack Trace
                          </summary>
                          <pre className="mt-2 p-2 bg-[color:var(--surface-2)] rounded text-xs overflow-x-auto">
                            {log.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
