import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const enhancedSentimentSchema = z.object({
  emotion: z.enum(["anger", "frustration", "confusion", "joy", "satisfaction", "neutral", "urgency", "complaint"]),
  sentimentScore: z.number().min(-1).max(1),
  confidenceScore: z.number().min(0).max(1),
  summary: z.string().max(150),
  reasoning: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  suggestedActions: z.array(z.string()).optional(),
  escalationRecommended: z.boolean(),
})

export async function POST(request: NextRequest) {
  try {
    const { message, customerTier, previousInteractions, channel, language, model } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Select AI model based on configuration
    let aiModel
    switch (model) {
      case "openai":
        aiModel = openai("gpt-4o-mini")
        break
      case "huggingface":
        // In production, you would use HuggingFace API here
        aiModel = openai("gpt-4o-mini") // Fallback for demo
        break
      case "google":
        // In production, you would use Google Cloud Natural Language API
        aiModel = openai("gpt-4o-mini") // Fallback for demo
        break
      case "azure":
        // In production, you would use Azure Text Analytics API
        aiModel = openai("gpt-4o-mini") // Fallback for demo
        break
      default:
        aiModel = openai("gpt-4o-mini")
    }

    const { object } = await generateObject({
      model: aiModel,
      schema: enhancedSentimentSchema,
      prompt: `Analyze this customer support message with enhanced context:

Message: "${message}"
Customer Tier: ${customerTier}
Previous Interactions: ${previousInteractions}
Channel: ${channel}
Language: ${language}

Provide a comprehensive sentiment analysis including:
1. Primary emotion (anger, frustration, confusion, joy, satisfaction, neutral, urgency, complaint)
2. Sentiment score from -1 (very negative) to +1 (very positive)
3. Confidence score from 0 to 1 for your analysis
4. Brief summary (max 150 characters)
5. Priority level based on sentiment, customer tier, and urgency
6. Whether escalation is recommended
7. Your reasoning for the classification

Consider:
- Customer tier affects priority (platinum/gold customers get higher priority)
- Multiple previous interactions may indicate frustration
- Channel context (phone calls are often more urgent than emails)
- Language nuances and cultural context
- Urgency indicators and escalation triggers`,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Enhanced sentiment analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}
