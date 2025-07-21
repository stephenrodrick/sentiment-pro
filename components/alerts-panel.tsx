"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Flame,
  Users,
  TrendingDown,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MessageCircle,
} from "lucide-react"

interface BrandAlert {
  id: string
  type: "viral_mention" | "negative_sentiment" | "competitor_activity" | "influencer_mention" | "crisis_detection"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  mentions: any[]
  timestamp: Date
  acknowledged: boolean
  assignedTo?: string
  actionTaken?: string
}

interface AlertsPanelProps {
  alerts: BrandAlert[]
  onAcknowledge: (id: string) => void
}

export function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "viral_mention":
        return <Flame className="h-4 w-4" />
      case "negative_sentiment":
        return <TrendingDown className="h-4 w-4" />
      case "competitor_activity":
        return <Shield className="h-4 w-4" />
      case "influencer_mention":
        return <Users className="h-4 w-4" />
      case "crisis_detection":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50 dark:bg-red-950"
      case "high":
        return "border-orange-500 bg-orange-50 dark:bg-orange-950"
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
      case "low":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950"
      default:
        return "border-gray-500 bg-gray-50 dark:bg-gray-950"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">CRITICAL</Badge>
      case "high":
        return (
          <Badge variant="default" className="bg-orange-600">
            HIGH
          </Badge>
        )
      case "medium":
        return <Badge variant="secondary">MEDIUM</Badge>
      case "low":
        return <Badge variant="outline">LOW</Badge>
      default:
        return <Badge variant="outline">UNKNOWN</Badge>
    }
  }

  const activeAlerts = alerts.filter((alert) => !alert.acknowledged)
  const acknowledgedAlerts = alerts.filter((alert) => alert.acknowledged)

  const alertsByType = alerts.reduce(
    (acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical" && !alert.acknowledged)

  return (
    <div className="space-y-6">
      {/* Alert Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Immediate action needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{acknowledgedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Acknowledged alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">4.2m</div>
            <p className="text-xs text-muted-foreground">Average response</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              Critical Alerts Requiring Immediate Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-red-900 rounded-lg border border-red-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-red-600">{getAlertIcon(alert.type)}</div>
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">{alert.title}</p>
                      <p className="text-sm text-red-600 dark:text-red-300">{alert.description}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => onAcknowledge(alert.id)}>
                    Acknowledge
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Management Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Alerts ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="acknowledged">Acknowledged ({acknowledgedAlerts.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Brand Alerts</CardTitle>
              <CardDescription>Alerts that require immediate attention and action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.severity)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white dark:bg-gray-800">{getAlertIcon(alert.type)}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{alert.title}</h3>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {alert.timestamp.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {alert.mentions.length} mentions
                            </span>
                            {alert.assignedTo && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {alert.assignedTo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => onAcknowledge(alert.id)}>
                          Acknowledge
                        </Button>
                        <Button size="sm" variant="default">
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Alert Details */}
                    {alert.mentions.length > 0 && (
                      <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Related Mentions:</h4>
                        <div className="space-y-2">
                          {alert.mentions.slice(0, 2).map((mention, index) => (
                            <div key={index} className="text-xs p-2 bg-white dark:bg-gray-800 rounded border">
                              <p className="line-clamp-2">
                                {mention.content?.text || mention.text || "Mention content"}
                              </p>
                              <div className="flex items-center justify-between mt-1 text-muted-foreground">
                                <span>@{mention.author?.username || mention.username || "unknown"}</span>
                                <span>{mention.platform || "platform"}</span>
                              </div>
                            </div>
                          ))}
                          {alert.mentions.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{alert.mentions.length - 2} more mentions</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {activeAlerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active alerts</p>
                    <p className="text-sm">All alerts have been acknowledged</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acknowledged">
          <Card>
            <CardHeader>
              <CardTitle>Acknowledged Alerts</CardTitle>
              <CardDescription>Previously resolved alerts and actions taken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {acknowledgedAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4 bg-green-50 dark:bg-green-950 border-green-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge variant="outline" className="text-green-700 border-green-300">
                              RESOLVED
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Resolved: {alert.timestamp.toLocaleString()}</span>
                            {alert.assignedTo && <span>By: {alert.assignedTo}</span>}
                          </div>
                          {alert.actionTaken && (
                            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 rounded text-xs">
                              <strong>Action Taken:</strong> {alert.actionTaken}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {acknowledgedAlerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No acknowledged alerts</p>
                    <p className="text-sm">Resolved alerts will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Types Distribution</CardTitle>
                <CardDescription>Breakdown of alert types over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(alertsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(type)}
                        <span className="capitalize">{type.replace("_", " ")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / alerts.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Response Metrics</CardTitle>
                <CardDescription>Performance metrics for alert management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Average Response Time</span>
                    <span className="text-lg font-bold text-blue-600">4.2 minutes</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Resolution Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {alerts.length > 0 ? ((acknowledgedAlerts.length / alerts.length) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Critical Alert Rate</span>
                    <span className="text-lg font-bold text-red-600">
                      {alerts.length > 0 ? ((criticalAlerts.length / alerts.length) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Total Alerts Today</span>
                    <span className="text-lg font-bold">{alerts.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
