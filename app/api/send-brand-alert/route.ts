import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json()

    console.log("🚨 BRAND ALERT RECEIVED:", JSON.stringify(alertData, null, 2))

    const notifications = {
      webhook: false,
      sms: false,
      email: false,
      slack: false,
    }

    // Send webhook notification
    if (process.env.WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(process.env.WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "brand_alert",
            alert: alertData,
            timestamp: new Date().toISOString(),
          }),
        })

        if (webhookResponse.ok) {
          notifications.webhook = true
          console.log("✅ Webhook notification sent successfully")
        }
      } catch (error) {
        console.error("❌ Webhook notification failed:", error)
      }
    }

    // Send SMS notification via Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.ALERT_PHONE_NUMBER) {
      try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID
        const authToken = process.env.TWILIO_AUTH_TOKEN
        const fromNumber = process.env.TWILIO_PHONE_NUMBER || "+1234567890"
        const toNumber = process.env.ALERT_PHONE_NUMBER

        const message = `🚨 BRAND ALERT: ${alertData.title}\n\n${alertData.description}\n\nSeverity: ${alertData.severity.toUpperCase()}\nTime: ${new Date().toLocaleString()}\n\nView details: ${process.env.DASHBOARD_URL || "https://your-dashboard.com"}/platform`

        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: fromNumber,
            To: toNumber,
            Body: message,
          }),
        })

        if (response.ok) {
          notifications.sms = true
          console.log("✅ SMS alert sent successfully")
        }
      } catch (error) {
        console.error("❌ SMS alert failed:", error)
      }
    }

    // Send email notification via SendGrid
    if (process.env.SENDGRID_API_KEY && process.env.ALERT_EMAIL) {
      try {
        const emailContent = {
          personalizations: [
            {
              to: [{ email: process.env.ALERT_EMAIL }],
              subject: `🚨 Brand Alert: ${alertData.title}`,
            },
          ],
          from: {
            email: process.env.FROM_EMAIL || "alerts@yourdomain.com",
            name: "Sentiment Watchdog Pro",
          },
          content: [
            {
              type: "text/html",
              value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; font-size: 24px;">🚨 Brand Alert</h1>
                  <p style="margin: 5px 0 0 0; opacity: 0.9;">Sentiment Watchdog Pro</p>
                </div>
                
                <div style="background: white; padding: 20px; border: 1px solid #e1e5e9; border-top: none;">
                  <div style="background: ${alertData.severity === "critical" ? "#fee2e2" : alertData.severity === "high" ? "#fef3c7" : "#f3f4f6"}; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <h2 style="margin: 0 0 10px 0; color: ${alertData.severity === "critical" ? "#dc2626" : alertData.severity === "high" ? "#d97706" : "#374151"};">
                      ${alertData.title}
                    </h2>
                    <p style="margin: 0; color: ${alertData.severity === "critical" ? "#7f1d1d" : alertData.severity === "high" ? "#92400e" : "#6b7280"};">
                      Severity: <strong>${alertData.severity.toUpperCase()}</strong>
                    </p>
                  </div>
                  
                  <div style="margin-bottom: 20px;">
                    <h3 style="color: #374151; margin-bottom: 10px;">Description</h3>
                    <p style="color: #6b7280; line-height: 1.6;">${alertData.description}</p>
                  </div>
                  
                  <div style="margin-bottom: 20px;">
                    <h3 style="color: #374151; margin-bottom: 10px;">Alert Details</h3>
                    <ul style="color: #6b7280; line-height: 1.6;">
                      <li><strong>Alert ID:</strong> ${alertData.alertId}</li>
                      <li><strong>Type:</strong> ${alertData.type.replace("_", " ").toUpperCase()}</li>
                      <li><strong>Timestamp:</strong> ${new Date(alertData.timestamp).toLocaleString()}</li>
                      <li><strong>Affected Mentions:</strong> ${alertData.affectedMentions?.length || 0}</li>
                    </ul>
                  </div>
                  
                  ${
                    alertData.affectedMentions && alertData.affectedMentions.length > 0
                      ? `
                  <div style="margin-bottom: 20px;">
                    <h3 style="color: #374151; margin-bottom: 10px;">Top Affected Mentions</h3>
                    ${alertData.affectedMentions
                      .slice(0, 3)
                      .map(
                        (mention: any) => `
                      <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                          <strong style="color: #374151;">${mention.author}</strong>
                          <span style="background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #6b7280;">
                            ${mention.platform}
                          </span>
                        </div>
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">
                          ${mention.followers?.toLocaleString()} followers • 
                          Sentiment: ${mention.sentiment?.emotion} (${mention.sentiment?.score?.toFixed(2)})
                        </p>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                  `
                      : ""
                  }
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.DASHBOARD_URL || "https://your-dashboard.com"}/platform" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                      View Full Dashboard
                    </a>
                  </div>
                </div>
                
                <div style="background: #f9fafb; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e1e5e9; border-top: none;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">
                    This alert was generated by Sentiment Watchdog Pro at ${new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            `,
            },
          ],
        }

        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailContent),
        })

        if (response.ok) {
          notifications.email = true
          console.log("✅ Email alert sent successfully")
        }
      } catch (error) {
        console.error("❌ Email alert failed:", error)
      }
    }

    // Send Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        const slackMessage = {
          text: `🚨 Brand Alert: ${alertData.title}`,
          attachments: [
            {
              color: alertData.severity === "critical" ? "danger" : alertData.severity === "high" ? "warning" : "good",
              fields: [
                {
                  title: "Severity",
                  value: alertData.severity.toUpperCase(),
                  short: true,
                },
                {
                  title: "Type",
                  value: alertData.type.replace("_", " ").toUpperCase(),
                  short: true,
                },
                {
                  title: "Description",
                  value: alertData.description,
                  short: false,
                },
                {
                  title: "Affected Mentions",
                  value: alertData.affectedMentions?.length || 0,
                  short: true,
                },
              ],
              footer: "Sentiment Watchdog Pro",
              ts: Math.floor(Date.now() / 1000),
            },
          ],
        }

        const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(slackMessage),
        })

        if (response.ok) {
          notifications.slack = true
          console.log("✅ Slack notification sent successfully")
        }
      } catch (error) {
        console.error("❌ Slack notification failed:", error)
      }
    }

    const response = {
      success: true,
      alertId: alertData.alertId,
      timestamp: new Date().toISOString(),
      notifications,
      message: "Brand alert processed successfully",
    }

    console.log("✅ BRAND ALERT PROCESSED:", JSON.stringify(response, null, 2))

    return NextResponse.json(response)
  } catch (error) {
    console.error("Brand alert processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process brand alert",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
