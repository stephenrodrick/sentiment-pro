import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages, alerts, stats, format, timeRange } = await request.json()

    switch (format) {
      case "csv":
        return exportCSV(messages, alerts, stats)
      case "json":
        return exportJSON(messages, alerts, stats, timeRange)
      case "pdf":
        return exportPDF(messages, alerts, stats)
      default:
        return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
    }
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}

function exportCSV(messages: any[], alerts: any[], stats: any) {
  const csvHeaders = [
    "Timestamp",
    "Customer Name",
    "Customer ID",
    "Channel",
    "Message",
    "Emotion",
    "Sentiment Score",
    "Confidence Score",
    "Priority",
    "Customer Tier",
    "Previous Interactions",
    "Escalated",
    "Tags",
  ].join(",")

  const csvRows = messages
    .map((msg) =>
      [
        msg.timestamp,
        `"${msg.customerName}"`,
        msg.customerId,
        msg.channel,
        `"${msg.message.replace(/"/g, '""')}"`,
        msg.emotion,
        msg.sentimentScore,
        msg.confidenceScore,
        msg.priority,
        msg.customerTier,
        msg.previousInteractions,
        msg.escalated,
        `"${msg.tags.join(", ")}"`,
      ].join(","),
    )
    .join("\n")

  const csvContent = `${csvHeaders}\n${csvRows}`

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="sentiment-data-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}

function exportJSON(messages: any[], alerts: any[], stats: any, timeRange: string) {
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      timeRange,
      totalMessages: messages.length,
      totalAlerts: alerts.length,
      version: "1.0",
    },
    statistics: stats,
    messages: messages.map((msg) => ({
      id: msg.id,
      timestamp: msg.timestamp,
      customer: {
        name: msg.customerName,
        id: msg.customerId,
        tier: msg.customerTier,
        previousInteractions: msg.previousInteractions,
      },
      communication: {
        channel: msg.channel,
        language: msg.language,
        message: msg.message,
        summary: msg.summary,
      },
      analysis: {
        emotion: msg.emotion,
        sentimentScore: msg.sentimentScore,
        confidenceScore: msg.confidenceScore,
        priority: msg.priority,
        escalated: msg.escalated,
        tags: msg.tags,
      },
    })),
    alerts: alerts.map((alert) => ({
      id: alert.id,
      timestamp: alert.timestamp,
      severity: alert.severity,
      summary: alert.summary,
      messageCount: alert.messageCount,
      averageSentiment: alert.averageSentiment,
      acknowledged: alert.acknowledged,
      affectedMessages: alert.messages.map((msg) => msg.id),
    })),
  }

  return NextResponse.json(exportData, {
    headers: {
      "Content-Disposition": `attachment; filename="sentiment-report-${new Date().toISOString().split("T")[0]}.json"`,
    },
  })
}

function exportPDF(messages: any[], alerts: any[], stats: any) {
  // In production, you would use a PDF generation library like jsPDF or Puppeteer
  const pdfContent = `
    SENTIMENT WATCHDOG PRO - REPORT
    Generated: ${new Date().toLocaleString()}
    
    SUMMARY STATISTICS
    ==================
    Total Messages: ${stats.totalMessages}
    Negative Messages: ${stats.negativeMessages}
    Average Sentiment: ${stats.averageSentiment.toFixed(3)}
    Active Alerts: ${alerts.length}
    Response Time: ${stats.responseTime.toFixed(1)} minutes
    Customer Satisfaction: ${stats.customerSatisfaction.toFixed(1)}%
    
    RECENT ALERTS
    =============
    ${alerts
      .slice(0, 10)
      .map(
        (alert) =>
          `${alert.timestamp}: ${alert.severity.toUpperCase()} - ${alert.summary} (${alert.messageCount} messages)`,
      )
      .join("\n")}
    
    TOP NEGATIVE MESSAGES
    ====================
    ${messages
      .filter((m) => m.sentimentScore < -0.3)
      .slice(0, 20)
      .map(
        (msg) =>
          `${msg.timestamp}: ${msg.customerName} (${msg.channel}) - Score: ${msg.sentimentScore.toFixed(2)}\n"${msg.summary}"`,
      )
      .join("\n\n")}
  `

  return new NextResponse(pdfContent, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="sentiment-report-${new Date().toISOString().split("T")[0]}.txt"`,
    },
  })
}
