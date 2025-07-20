import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { alert, config } = await request.json()

    // Enhanced alert payload for multiple notification channels
    const alertPayload = {
      timestamp: new Date().toISOString(),
      alert,
      notifications: {
        slack: config.slackEnabled ? await sendSlackNotification(alert) : null,
        email: config.emailEnabled ? await sendEmailNotification(alert) : null,
      },
    }

    console.log("🚨 ENHANCED ALERT NOTIFICATION:", alertPayload)

    return NextResponse.json({
      success: true,
      message: "Enhanced alert notification sent successfully",
      channels: {
        slack: config.slackEnabled,
        email: config.emailEnabled,
      },
    })
  } catch (error) {
    console.error("Enhanced alert notification error:", error)
    return NextResponse.json({ error: "Failed to send enhanced alert notification" }, { status: 500 })
  }
}

async function sendSlackNotification(alert: any) {
  // In production, this would use the Slack Web API
  const slackPayload = {
    text: `🚨 Sentiment Alert: ${alert.summary}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `🚨 ${alert.severity.toUpperCase()} Sentiment Alert`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Messages:* ${alert.messageCount}`,
          },
          {
            type: "mrkdwn",
            text: `*Avg Sentiment:* ${alert.averageSentiment.toFixed(2)}`,
          },
          {
            type: "mrkdwn",
            text: `*Severity:* ${alert.severity}`,
          },
          {
            type: "mrkdwn",
            text: `*Time:* ${new Date(alert.timestamp).toLocaleString()}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: alert.summary,
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
            url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            style: "primary",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Acknowledge",
            },
            action_id: `acknowledge_${alert.id}`,
          },
        ],
      },
    ],
  }

  // In production: await fetch(process.env.SLACK_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(slackPayload) })
  return slackPayload
}

async function sendEmailNotification(alert: any) {
  // In production, this would use SendGrid, AWS SES, or similar
  const emailPayload = {
    to: process.env.ALERT_EMAIL_RECIPIENTS?.split(",") || ["support-lead@company.com"],
    from: process.env.SENDGRID_FROM_EMAIL || "alerts@company.com",
    subject: `🚨 ${alert.severity.toUpperCase()} Sentiment Alert - ${alert.messageCount} negative messages`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #dc3545; margin: 0;">🚨 Sentiment Alert</h1>
          <p style="margin: 5px 0 0 0; color: #6c757d;">Severity: ${alert.severity.toUpperCase()}</p>
        </div>
        
        <div style="background: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h2 style="color: #495057; margin-top: 0;">${alert.summary}</h2>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div>
              <strong>Messages Affected:</strong><br>
              <span style="font-size: 24px; color: #dc3545;">${alert.messageCount}</span>
            </div>
            <div>
              <strong>Average Sentiment:</strong><br>
              <span style="font-size: 24px; color: #dc3545;">${alert.averageSentiment.toFixed(2)}</span>
            </div>
          </div>
          
          <div style="margin: 20px 0;">
            <strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}<br>
            <strong>Alert ID:</strong> ${alert.id}
          </div>
          
          <div style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Dashboard
            </a>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #6c757d;">
          This is an automated alert from Sentiment Watchdog Pro. 
          Please do not reply to this email.
        </div>
      </div>
    `,
  }

  // In production: await sgMail.send(emailPayload)
  return emailPayload
}
