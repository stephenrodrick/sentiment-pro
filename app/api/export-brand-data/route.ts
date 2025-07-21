import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const exportData = await request.json()
    const { format, brandMonitoring, mentions, alerts, analytics } = exportData

    if (format === "json") {
      const jsonData = JSON.stringify(exportData, null, 2)

      return new NextResponse(jsonData, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="brand-monitoring-${new Date().toISOString().split("T")[0]}.json"`,
        },
      })
    }

    if (format === "csv") {
      // Convert mentions to CSV
      const csvHeaders = [
        "ID",
        "Timestamp",
        "Platform",
        "Author",
        "Username",
        "Followers",
        "Verified",
        "Influencer Tier",
        "Content",
        "Likes",
        "Shares",
        "Comments",
        "Views",
        "Engagement",
        "Reach",
        "Sentiment Score",
        "Emotion",
        "Confidence",
        "Brand Relevance",
        "Viral Potential",
        "Category",
        "Priority",
        "Hashtags",
        "Keywords",
      ].join(",")

      const csvRows = mentions.map((mention: any) =>
        [
          mention.id,
          mention.timestamp,
          mention.platform,
          `"${mention.author.displayName}"`,
          mention.author.username,
          mention.author.followers,
          mention.author.verified,
          mention.author.influencerTier,
          `"${mention.content.replace(/"/g, '""')}"`,
          mention.metrics.likes,
          mention.metrics.shares,
          mention.metrics.comments,
          mention.metrics.views,
          mention.metrics.engagement,
          mention.metrics.reach,
          mention.sentiment.score,
          mention.sentiment.emotion,
          mention.sentiment.confidence,
          mention.brandRelevance,
          mention.viralPotential,
          mention.category,
          mention.priority,
          `"${mention.hashtags.join(", ")}"`,
          `"${mention.keywords.join(", ")}"`,
        ].join(","),
      )

      const csvContent = [csvHeaders, ...csvRows].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="brand-monitoring-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    if (format === "pdf") {
      // Generate PDF report
      const pdfContent = `
        Brand Monitoring Report
        Generated: ${new Date().toLocaleString()}
        
        SUMMARY
        ========
        Total Mentions: ${analytics.totalMentions}
        Brand Health: ${analytics.brandHealth.toFixed(1)}%
        Share of Voice: ${analytics.shareOfVoice.toFixed(1)}%
        Average Sentiment: ${analytics.averageSentiment.toFixed(2)}
        
        PLATFORM BREAKDOWN
        ==================
        ${mentions.reduce((acc: any, mention: any) => {
          acc[mention.platform] = (acc[mention.platform] || 0) + 1
          return acc
        }, {})}
        
        TOP MENTIONS
        ============
        ${mentions
          .slice(0, 10)
          .map(
            (mention: any, index: number) => `
        ${index + 1}. @${mention.author.username} (${mention.platform})
           "${mention.content.substring(0, 100)}..."
           Sentiment: ${mention.sentiment.score.toFixed(2)} | Engagement: ${mention.metrics.engagement.toFixed(1)}%
        `,
          )
          .join("\n")}
        
        ALERTS SUMMARY
        ==============
        Total Alerts: ${alerts.length}
        Critical: ${alerts.filter((a: any) => a.severity === "critical").length}
        High: ${alerts.filter((a: any) => a.severity === "high").length}
        Medium: ${alerts.filter((a: any) => a.severity === "medium").length}
        Low: ${alerts.filter((a: any) => a.severity === "low").length}
      `

      return new NextResponse(pdfContent, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename="brand-monitoring-report-${new Date().toISOString().split("T")[0]}.txt"`,
        },
      })
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
  } catch (error) {
    console.error("Export failed:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
