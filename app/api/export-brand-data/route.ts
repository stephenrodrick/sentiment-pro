import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const exportData = await request.json()

    console.log(
      "📊 BRAND DATA EXPORT REQUEST:",
      JSON.stringify(
        {
          format: exportData.format,
          timestamp: exportData.timestamp,
          totalMentions: exportData.mentions?.length || 0,
          totalAlerts: exportData.alerts?.length || 0,
          brandHealth: exportData.analytics?.brandHealth,
          shareOfVoice: exportData.analytics?.shareOfVoice,
        },
        null,
        2,
      ),
    )

    const { format } = exportData

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
        "Sentiment Emotion",
        "Confidence",
        "Brand Relevance",
        "Viral Potential",
        "Priority",
        "Category",
        "Hashtags",
        "Keywords",
        "Location",
        "Language",
      ]

      const csvRows =
        exportData.mentions?.map((mention: any) => [
          mention.id,
          mention.timestamp,
          mention.platform,
          mention.author?.displayName || "",
          mention.author?.username || "",
          mention.author?.followers || 0,
          mention.author?.verified || false,
          mention.author?.influencerTier || "",
          `"${mention.content?.replace(/"/g, '""') || ""}"`,
          mention.metrics?.likes || 0,
          mention.metrics?.shares || 0,
          mention.metrics?.comments || 0,
          mention.metrics?.views || 0,
          mention.metrics?.engagement || 0,
          mention.metrics?.reach || 0,
          mention.sentiment?.score || 0,
          mention.sentiment?.emotion || "",
          mention.sentiment?.confidence || 0,
          mention.brandRelevance || 0,
          mention.viralPotential || 0,
          mention.priority || "",
          mention.category || "",
          `"${mention.hashtags?.join(", ") || ""}"`,
          `"${mention.keywords?.join(", ") || ""}"`,
          mention.location || "",
          mention.language || "",
        ]) || []

      const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.join(","))].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="brand-monitoring-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    if (format === "pdf") {
      // For PDF, we'll return a simple text-based report
      const pdfContent = `
BRAND MONITORING REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY
=======
Total Mentions: ${exportData.mentions?.length || 0}
Brand Health: ${exportData.analytics?.brandHealth?.toFixed(1) || 0}%
Share of Voice: ${exportData.analytics?.shareOfVoice?.toFixed(1) || 0}%
Total Alerts: ${exportData.alerts?.length || 0}

RECENT MENTIONS
===============
${
  exportData.mentions
    ?.slice(0, 10)
    .map(
      (mention: any, index: number) => `
${index + 1}. ${mention.author?.displayName || "Unknown"} (@${mention.author?.username || "unknown"})
   Platform: ${mention.platform}
   Sentiment: ${mention.sentiment?.emotion} (${mention.sentiment?.score?.toFixed(2) || 0})
   Content: ${mention.content?.substring(0, 100) || ""}...
   Engagement: ${mention.metrics?.likes || 0} likes, ${mention.metrics?.shares || 0} shares
   Timestamp: ${new Date(mention.timestamp).toLocaleString()}
`,
    )
    .join("\n") || "No mentions available"
}

ALERTS SUMMARY
==============
${
  exportData.alerts
    ?.slice(0, 5)
    .map(
      (alert: any, index: number) => `
${index + 1}. ${alert.title}
   Severity: ${alert.severity?.toUpperCase()}
   Type: ${alert.type?.replace("_", " ").toUpperCase()}
   Status: ${alert.acknowledged ? "Acknowledged" : "Pending"}
   Time: ${new Date(alert.timestamp).toLocaleString()}
`,
    )
    .join("\n") || "No alerts available"
}

ANALYTICS
=========
Positive Mentions: ${exportData.analytics?.positiveMentions || 0}
Negative Mentions: ${exportData.analytics?.negativeMentions || 0}
Neutral Mentions: ${exportData.analytics?.neutralMentions || 0}
Average Sentiment: ${exportData.analytics?.averageSentiment?.toFixed(2) || 0}
Total Reach: ${exportData.analytics?.totalReach?.toLocaleString() || 0}
Influencer Mentions: ${exportData.analytics?.influencerMentions || 0}
Viral Posts: ${exportData.analytics?.viralPosts || 0}

---
Report generated by Sentiment Watchdog Pro
      `.trim()

      return new NextResponse(pdfContent, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename="brand-monitoring-${new Date().toISOString().split("T")[0]}.txt"`,
        },
      })
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
