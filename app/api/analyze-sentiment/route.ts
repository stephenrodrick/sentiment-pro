import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const sentimentSchema = z.object({
  score: z.number().min(-1).max(1),
  emotion: z.enum(["positive", "negative", "neutral", "mixed"]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  keywords: z.array(z.string()),
  urgency: z.enum(["low", "medium", "high", "critical"]),
})

export async function POST(request: NextRequest) {
  try {
    const { text, context } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found, using fallback analysis")

      // Simple fallback sentiment analysis
      const lowerText = text.toLowerCase()
      const positiveWords = [
        "good",
        "great",
        "excellent",
        "amazing",
        "love",
        "awesome",
        "fantastic",
        "wonderful",
        "perfect",
        "outstanding",
      ]
      const negativeWords = [
        "bad",
        "terrible",
        "awful",
        "hate",
        "horrible",
        "worst",
        "disappointing",
        "frustrating",
        "annoying",
        "useless",
      ]

      const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length
      const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length

      let score = 0
      let emotion: "positive" | "negative" | "neutral" | "mixed" = "neutral"

      if (positiveCount > negativeCount) {
        score = Math.min(0.8, positiveCount * 0.2)
        emotion = "positive"
      } else if (negativeCount > positiveCount) {
        score = Math.max(-0.8, negativeCount * -0.2)
        emotion = "negative"
      }

      return NextResponse.json({
        score,
        emotion,
        confidence: 0.6,
        reasoning: "Fallback keyword-based analysis",
        keywords: [
          ...positiveWords.filter((w) => lowerText.includes(w)),
          ...negativeWords.filter((w) => lowerText.includes(w)),
        ],
        urgency: Math.abs(score) > 0.6 ? "high" : "medium",
        fallback: true,
      })
    }

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: sentimentSchema,
      prompt: `Analyze the sentiment of this text: "${text}"
      
      Context: ${context || "General social media mention"}
      
      Provide:
      1. Sentiment score from -1 (very negative) to +1 (very positive)
      2. Primary emotion category
      3. Confidence level in your analysis
      4. Brief reasoning for your assessment
      5. Key sentiment-bearing words/phrases
      6. Urgency level for response (low/medium/high/critical)
      
      Consider context, sarcasm, and nuanced language patterns.`,
    })

    const analysisOutput = {
      timestamp: new Date().toISOString(),
      input: {
        text: text.substring(0, 200) + (text.length > 200 ? "..." : ""),
        context: context || "general",
        length: text.length,
      },
      analysis: {
        sentiment: {
          score: object.score,
          emotion: object.emotion,
          confidence: object.confidence,
          reasoning: object.reasoning,
        },
        keywords: object.keywords,
        urgency: object.urgency,
        actionRequired: object.urgency === "high" || object.urgency === "critical",
      },
      processing: {
        model: "openai-gpt-4o-mini",
        timestamp: new Date().toISOString(),
        processed: true,
      },
    }

    console.log("🧠 SENTIMENT ANALYZED:", JSON.stringify(analysisOutput, null, 2))

    return NextResponse.json(object)
  } catch (error) {
    console.error("Sentiment analysis error:", error)

    // Return fallback response
    return NextResponse.json({
      score: 0,
      emotion: "neutral",
      confidence: 0.5,
      reasoning: "Analysis failed, using neutral fallback",
      keywords: [],
      urgency: "medium",
      error: true,
    })
  }
}
