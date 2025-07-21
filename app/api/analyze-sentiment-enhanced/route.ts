import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const enhancedSentimentSchema = z.object({
  emotion: z.enum(["anger", "frustration", "confusion", "joy", "satisfaction", "neutral"]),
  sentimentScore: z.number().min(-1).max(1),
  confidenceScore: z.number().min(0).max(1),
  summary: z.string().max(150),
  reasoning: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  suggestedActions: z.array(z.string()).optional(),
  escalationRecommended: z.boolean(),
  urgencyLevel: z.number().min(1).max(10),
  customerSatisfactionRisk: z.enum(["low", "medium", "high", "critical"]),
})

export async function POST(request: NextRequest) {
  try {
    const { message, customerName, customerId, channel, customerTier, previousInteractions, priority, tags } =
      await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: enhancedSentimentSchema,
      prompt: `Analyze this customer support message with comprehensive sentiment analysis:

Customer Information:
- Name: ${customerName}
- ID: ${customerId}
- Tier: ${customerTier}
- Channel: ${channel}
- Previous Interactions: ${previousInteractions}
- Current Priority: ${priority}
- Tags: ${tags?.join(", ") || "None"}

Message: "${message}"

Provide a detailed sentiment analysis including:

1. Primary emotion (anger, frustration, confusion, joy, satisfaction, neutral)
2. Sentiment score from -1 (very negative) to +1 (very positive)
3. Confidence score from 0 to 1 for your analysis accuracy
4. Brief summary (max 150 characters)
5. Detailed reasoning for your classification
6. Priority level recommendation based on sentiment and context
7. Suggested actions for the support team
8. Whether escalation is recommended
9. Urgency level from 1-10
10. Customer satisfaction risk assessment

Consider these factors:
- Customer tier affects priority (platinum/gold customers get higher priority)
- Multiple previous interactions may indicate frustration
- Channel context (phone calls are often more urgent than emails)
- Specific keywords that indicate urgency, anger, or satisfaction
- Business impact and revenue risk
- Escalation triggers and customer retention factors`,
    })

    // Log the analysis for monitoring
    console.log("🔍 SENTIMENT ANALYSIS COMPLETE:", {
      messageId: `${customerId}-${Date.now()}`,
      customer: customerName,
      channel,
      emotion: object.emotion,
      sentimentScore: object.sentimentScore,
      confidence: object.confidenceScore,
      escalationRecommended: object.escalationRecommended,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Enhanced sentiment analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}
