import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const sentimentSchema = z.object({
  emotion: z.enum(["anger", "frustration", "confusion", "joy", "satisfaction", "neutral"]),
  sentimentScore: z.number().min(-1).max(1),
  summary: z.string(),
  reasoning: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: sentimentSchema,
      prompt: `Analyze the sentiment and emotion of this customer support message:

"${message}"

Provide:
1. The primary emotion (anger, frustration, confusion, joy, satisfaction, or neutral)
2. A sentiment score from -1 (very negative) to +1 (very positive)
3. A brief summary of the message (max 100 characters)
4. Your reasoning for the classification

Consider the context of customer support where customers may be experiencing issues.`,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Sentiment analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}
