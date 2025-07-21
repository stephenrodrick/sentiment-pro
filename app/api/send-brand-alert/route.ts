import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json()

    // Send SMS alert via Twilio
    if (alertData.notifications.sms && alertData.severity === "critical") {
      try {
        const twilioResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              From: process.env.TWILIO_PHONE_NUMBER || "+1234567890",
              To: process.env.ALERT_PHONE_NUMBER || "+1234567890",
              Body: `🚨 BRAND ALERT: ${alertData.title}\n\n${alertData.description}\n\nSeverity: ${alertData.severity.toUpperCase()}\nMentions: ${alertData.affectedMentions.length}\n\nTime: ${new Date().toLocaleString()}`,
            }),
          },
        )

        if (twilioResponse.ok) {
          console.log("✅ SMS alert sent successfully")
        }
      } catch (smsError) {
        console.error("SMS alert failed:", smsError)
      }
    }

    // Send email alert via SendGrid
    if (alertData.notifications.email) {
      try {
        const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email: process.env.ALERT_EMAIL || "alerts@yourbrand.com" }],
                subject: `🚨 Brand Alert: ${alertData.title}`,
              },
            ],
            from: { email: process.env.FROM_EMAIL || "noreply@yourbrand.com", name: "Brand Monitoring System" },
            content: [
              {
                type: "text/html",
                value: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">🚨 Brand Alert Triggered</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">${new Date().toLocaleString()}</p>
                  </div>
                  
                  <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
                    <div style="background: ${alertData.severity === "critical" ? "#fee2e2" : alertData.severity === "high" ? "#fef3c7" : "#dbeafe"}; 
                                border-left: 4px solid ${alertData.severity === "critical" ? "#dc2626" : alertData.severity === "high" ? "#d97706" : "#2563eb"}; 
                                padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                      <h2 style="margin: 0 0 10px 0; color: ${alertData.severity === "critical" ? "#dc2626" : alertData.severity === "high" ? "#d97706" : "#2563eb"};">
                        ${alertData.title}
                      </h2>
                      <p style="margin: 0; color: #374151;">${alertData.description}</p>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                      <div style="text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${alertData.affectedMentions.length}</div>
                        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Mentions</div>
                      </div>
                      <div style="text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: ${alertData.severity === "critical" ? "#dc2626" : "#d97706"};">
                          ${alertData.severity.toUpperCase()}
                        </div>
                        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Severity</div>
                      </div>
                      <div style="text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px;">
                        <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${alertData.brandContext.averageSentiment.toFixed(2)}</div>
                        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">Avg Sentiment</div>
                      </div>
                    </div>

                    <h3 style="color: #1f2937; margin-bottom: 15px;">Affected Mentions:</h3>
                    ${alertData.affectedMentions
                      .slice(0, 3)
                      .map(
                        (mention: any) => `
                      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                          <strong style="color: #1f2937;">@${mention.author}</strong>
                          <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #6b7280;">
                            ${mention.platform} • ${mention.followers.toLocaleString()} followers
                          </span>
                        </div>
                        <p style="margin: 0; color: #4b5563; font-style: italic;">"${mention.url}"</p>
                        <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
                          Sentiment: <span style="color: ${mention.sentiment.score > 0 ? "#059669" : "#dc2626"};">${mention.sentiment.score.toFixed(2)}</span> • 
                          Viral Potential: ${(mention.viralPotential * 100).toFixed(0)}%
                        </div>
                      </div>
                    `,
                      )
                      .join("")}

                    <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
                      <p style="margin: 0 0 15px 0; color: #4b5563;">Take immediate action to address this alert</p>
                      <a href="${process.env.DASHBOARD_URL || "https://yourbrand.com/platform"}" 
                         style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                        View Dashboard
                      </a>
                    </div>
                  </div>
                  
                  <div style="background: #f9fafb; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
                    <p style="margin: 0; font-size: 12px; color: #6b7280;">
                      Sentiment Watchdog Pro • Brand Monitoring System<br>
                      This is an automated alert. Please do not reply to this email.
                    </p>
                  </div>
                </div>
              `,
              },
            ],
          }),
        })

        if (emailResponse.ok) {
          console.log("✅ Email alert sent successfully")
        }
      } catch (emailError) {
        console.error("Email alert failed:", emailError)
      }
    }

    // Send Slack notification
    if (alertData.notifications.slack && process.env.SLACK_WEBHOOK_URL) {
      try {
        const slackResponse = await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🚨 Brand Alert: ${alertData.title}`,
            attachments: [
              {
                color:
                  alertData.severity === "critical" ? "danger" : alertData.severity === "high" ? "warning" : "good",
                fields: [
                  { title: "Severity", value: alertData.severity.toUpperCase(), short: true },
                  { title: "Mentions", value: alertData.affectedMentions.length.toString(), short: true },
                  { title: "Description", value: alertData.description, short: false },
                ],
                footer: "Sentiment Watchdog Pro",
                ts: Math.floor(Date.now() / 1000),
              },
            ],
          }),
        })

        if (slackResponse.ok) {
          console.log("✅ Slack alert sent successfully")
        }
      } catch (slackError) {
        console.error("Slack alert failed:", slackError)
      }
    }

    // Send webhook notification
    if (alertData.notifications.webhook && process.env.WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(process.env.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "brand_alert",
            data: alertData,
            timestamp: new Date().toISOString(),
          }),
        })

        if (webhookResponse.ok) {
          console.log("✅ Webhook notification sent successfully")
        }
      } catch (webhookError) {
        console.error("Webhook notification failed:", webhookError)
      }
    }

    return NextResponse.json({
      success: true,
      alertId: alertData.alertId,
      notificationsSent: {
        sms: alertData.notifications.sms && alertData.severity === "critical",
        email: alertData.notifications.email,
        slack: alertData.notifications.slack,
        webhook: alertData.notifications.webhook,
        dashboard: true,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Brand alert sending failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send brand alert",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
