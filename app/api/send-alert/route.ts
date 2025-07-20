import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json()

    console.log("🚨 ALERT TRIGGERED:", JSON.stringify(alertData, null, 2))

    const notifications = {
      sms: false,
      email: false,
      slack: false,
      webhook: false,
    }

    // Send SMS via Twilio if configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && alertData.severity === "critical") {
      try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID
        const authToken = process.env.TWILIO_AUTH_TOKEN
        const fromNumber = process.env.TWILIO_PHONE_NUMBER || "+1234567890"
        const toNumber = process.env.ALERT_PHONE_NUMBER || "+1234567890"

        const message = `🚨 CRITICAL ALERT: ${alertData.title}\n\nSentiment: ${alertData.sentiment.emotion} (${alertData.sentiment.score.toFixed(2)})\nText: "${alertData.text.substring(0, 100)}..."\n\nTime: ${new Date().toLocaleString()}`

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

    // Send Email via SendGrid
    if (process.env.SENDGRID_API_KEY && process.env.ALERT_EMAIL) {
      try {
        const emailData = {
          personalizations: [
            {
              to: [{ email: process.env.ALERT_EMAIL }],
              subject: `🚨 Sentiment Alert: ${alertData.title}`,
            },
          ],
          from: {
            email: process.env.FROM_EMAIL || "alerts@sentimentwatchdog.com",
            name: "Sentiment Watchdog Pro",
          },
          content: [
            {
              type: "text/html",
              value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; font-size: 24px;">🚨 Sentiment Alert</h1>
                  <p style="margin: 5px 0 0 0; opacity: 0.9;">Sentiment Watchdog Pro</p>
                </div>
                
                <div style="background: white; padding: 20px; border: 1px solid #e1e5e9; border-top: none;">
                  <div style="background: ${alertData.severity === "critical" ? "#fee2e2" : "#fef3c7"}; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <h2 style="margin: 0 0 10px 0; color: ${alertData.severity === "critical" ? "#dc2626" : "#d97706"};">
                      ${alertData.title}
                    </h2>
                    <p style="margin: 0; color: ${alertData.severity === "critical" ? "#7f1d1d" : "#92400e"};">
                      Severity: <strong>${alertData.severity.toUpperCase()}</strong>
                    </p>
                  </div>
                  
                  <div style="margin-bottom: 20px;">
                    <h3 style="color: #374151; margin-bottom: 10px;">Message Content</h3>
                    <p style="background: #f9fafb; padding: 15px; border-radius: 6px; color: #374151; font-style: italic;">
                      "${alertData.text}"
                    </p>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div style="text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px;">
                      <div style="font-size: 24px; font-weight: bold; color: ${alertData.sentiment.score > 0 ? "#059669" : "#dc2626"};">
                        ${alertData.sentiment.score.toFixed(2)}
                      </div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Sentiment Score</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px;">
                      <div style="font-size: 18px; font-weight: bold; color: #1f2937; text-transform: capitalize;">
                        ${alertData.sentiment.emotion}
                      </div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Emotion</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px;">
                      <div style="font-size: 18px; font-weight: bold; color: #1f2937;">
                        ${(alertData.sentiment.confidence * 100).toFixed(0)}%
                      </div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Confidence</div>
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.DASHBOARD_URL || "http://localhost:3000"}/platform" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                      View Dashboard
                    </a>
                  </div>
                </div>
                
                <div style="background: #f9fafb; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e1e5e9; border-top: none;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">
                    Alert generated at ${new Date().toLocaleString()} by Sentiment Watchdog Pro
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
          body: JSON.stringify(emailData),
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
          text: `🚨 Sentiment Alert: ${alertData.title}`,
          attachments: [
            {
              color: alertData.severity === "critical" ? "danger" : "warning",
              fields: [
                {
                  title: "Sentiment",
                  value: `${alertData.sentiment.emotion} (${alertData.sentiment.score.toFixed(2)})`,
                  short: true,
                },
                { title: "Confidence", value: `${(alertData.sentiment.confidence * 100).toFixed(0)}%`, short: true },
                { title: "Severity", value: alertData.severity.toUpperCase(), short: true },
                {
                  title: "Message",
                  value: `"${alertData.text.substring(0, 200)}${alertData.text.length > 200 ? "..." : ""}"`,
                  short: false,
                },
              ],
              footer: "Sentiment Watchdog Pro",
              ts: Math.floor(Date.now() / 1000),
            },
          ],
        }

        const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

    // Send Webhook notification
    if (process.env.WEBHOOK_URL) {
      try {
        const webhookData = {
          event: "sentiment_alert",
          data: alertData,
          timestamp: new Date().toISOString(),
          notifications,
        }

        const response = await fetch(process.env.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookData),
        })

        if (response.ok) {
          notifications.webhook = true
          console.log("✅ Webhook notification sent successfully")
        }
      } catch (error) {
        console.error("❌ Webhook notification failed:", error)
      }
    }

    return NextResponse.json({
      success: true,
      alertId: alertData.id || `alert_${Date.now()}`,
      notifications,
      timestamp: new Date().toISOString(),
      message: "Alert processed successfully",
    })
  } catch (error) {
    console.error("Alert processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process alert",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
