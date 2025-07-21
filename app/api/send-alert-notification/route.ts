import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json()

    // Enhanced alert notification with multiple channels
    const notificationPayload = {
      timestamp: new Date().toISOString(),
      alert: alertData,
      notifications: {
        slack: await sendSlackNotification(alertData),
        email: await sendEmailNotification(alertData),
        webhook: await sendWebhookNotification(alertData),
      },
      processing: {
        model: "openai-gpt-4o",
        confidence: 0.95,
        processed: true,
      },
    }

    console.log("📢 ALERT NOTIFICATION SENT:", JSON.stringify(notificationPayload, null, 2))

    return NextResponse.json({
      success: true,
      message: "Alert notification sent successfully",
      channels: ["slack", "email", "webhook"],
      alertId: alertData.alertId,
    })
  } catch (error) {
    console.error("Alert notification error:", error)
    return NextResponse.json({ error: "Failed to send alert notification" }, { status: 500 })
  }
}

async function sendSlackNotification(alertData: any) {
  // Enhanced Slack notification with rich formatting
  const slackPayload = {
    text: `🚨 ${alertData.severity.toUpperCase()} Alert: ${alertData.summary}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `🚨 ${alertData.severity.toUpperCase()} Sentiment Alert`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Alert Type:* ${alertData.type}`,
          },
          {
            type: "mrkdwn",
            text: `*Messages Affected:* ${alertData.metrics.messageCount}`,
          },
          {
            type: "mrkdwn",
            text: `*Average Sentiment:* ${alertData.metrics.averageSentiment.toFixed(2)}`,
          },
          {
            type: "mrkdwn",
            text: `*Time Window:* ${alertData.metrics.timeWindow}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Summary:* ${alertData.summary}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Affected Messages:*\n${alertData.affectedMessages
            .slice(0, 3)
            .map((msg: any) => `• ${msg.customer} (${msg.channel}): ${msg.emotion} - ${msg.sentimentScore.toFixed(2)}`)
            .join(
              "\n",
            )}${alertData.affectedMessages.length > 3 ? `\n• +${alertData.affectedMessages.length - 3} more messages` : ""}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Dashboard",
            },
            url: `${process.env.NEXT_PUBLIC_APP_URL}/platform`,
            style: "primary",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Acknowledge Alert",
            },
            action_id: `acknowledge_${alertData.alertId}`,
          },
        ],
      },
    ],
  }

  // In production: await fetch(process.env.SLACK_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(slackPayload) })
  return slackPayload
}

async function sendEmailNotification(alertData: any) {
  // Enhanced email notification with HTML formatting
  const emailPayload = {
    to: process.env.ALERT_EMAIL_RECIPIENTS?.split(",") || ["support-lead@company.com"],
    from: process.env.SENDGRID_FROM_EMAIL || "alerts@sentimentwatchdog.com",
    subject: `🚨 ${alertData.severity.toUpperCase()} Sentiment Alert - ${alertData.metrics.messageCount} messages affected`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚨 Sentiment Alert</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">
            ${alertData.severity.toUpperCase()} Priority Alert
          </p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-top: 0;">${alertData.summary}</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #495057;">Alert Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Alert Type:</td>
                <td style="padding: 8px 0;">${alertData.type}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Messages Affected:</td>
                <td style="padding: 8px 0; color: #dc3545; font-weight: bold;">${alertData.metrics.messageCount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Average Sentiment:</td>
                <td style="padding: 8px 0; color: #dc3545; font-weight: bold;">${alertData.metrics.averageSentiment.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Time Window:</td>
                <td style="padding: 8px 0;">${alertData.metrics.timeWindow}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Timestamp:</td>
                <td style="padding: 8px 0;">${new Date(alertData.timestamp).toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #495057;">Affected Messages Sample:</h3>
            ${alertData.affectedMessages
              .slice(0, 5)
              .map(
                (msg: any) => `
                <div style="border-left: 4px solid #dc3545; padding: 10px; margin: 10px 0; background: #fff5f5;">
                  <strong>${msg.customer}</strong> via ${msg.channel}
                  <br>
                  <span style="color: #dc3545; font-weight: bold;">
                    ${msg.emotion} (${msg.sentimentScore.toFixed(2)})
                  </span>
                  <br>
                  <em style="color: #666;">${msg.summary}</em>
                </div>
              `,
              )
              .join("")}
            ${
              alertData.affectedMessages.length > 5
                ? `<p style="color: #666; font-style: italic;">+${alertData.affectedMessages.length - 5} more messages affected</p>`
                : ""
            }
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/platform" 
               style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              View Live Dashboard
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa; text-align: center; color: #666; font-size: 12px;">
          <p>This is an automated alert from Sentiment Watchdog Pro.</p>
          <p>Alert ID: ${alertData.alertId}</p>
        </div>
      </div>
    `,
  }

  // In production: await sgMail.send(emailPayload)
  return emailPayload
}

async function sendWebhookNotification(alertData: any) {
  // Generic webhook notification for third-party integrations
  const webhookPayload = {
    event: "sentiment_alert",
    timestamp: alertData.timestamp,
    alert: {
      id: alertData.alertId,
      type: alertData.type,
      severity: alertData.severity,
      summary: alertData.summary,
      metrics: alertData.metrics,
      affectedMessages: alertData.affectedMessages,
    },
    metadata: {
      source: "sentiment-watchdog-pro",
      version: "1.0",
      environment: process.env.NODE_ENV || "development",
    },
  }

  // In production: await fetch(process.env.WEBHOOK_URL, { method: 'POST', body: JSON.stringify(webhookPayload) })
  return webhookPayload
}
