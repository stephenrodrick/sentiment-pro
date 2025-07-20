import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mention, brandKeywords, competitorKeywords } = body

    if (!mention) {
      return NextResponse.json({ error: "Mention data is required" }, { status: 400 })
    }

    // Always use fallback analysis to avoid API quota issues
    console.log("Using fallback analysis for brand mention processing")

    // Enhanced fallback analysis based on content
    const text = mention.content.text.toLowerCase()
    let sentimentScore = 0
    let emotion: "positive" | "negative" | "neutral" | "mixed" = "neutral"

    // Comprehensive sentiment analysis keywords
    const positiveWords = [
      "love",
      "great",
      "amazing",
      "excellent",
      "fantastic",
      "awesome",
      "perfect",
      "wonderful",
      "outstanding",
      "brilliant",
      "incredible",
      "superb",
      "magnificent",
      "exceptional",
      "marvelous",
      "impressive",
      "remarkable",
      "phenomenal",
      "spectacular",
      "fabulous",
      "terrific",
      "splendid",
      "delightful",
      "charming",
      "beautiful",
      "stunning",
      "gorgeous",
      "lovely",
      "adorable",
      "recommend",
      "recommending",
      "highly recommend",
      "must have",
      "best",
      "top",
      "favorite",
      "thank you",
      "thanks",
      "grateful",
      "appreciate",
      "satisfied",
      "happy",
      "pleased",
      "excited",
      "thrilled",
      "overjoyed",
      "ecstatic",
      "elated",
      "cheerful",
      "optimistic",
    ]

    const negativeWords = [
      "hate",
      "terrible",
      "awful",
      "bad",
      "worst",
      "horrible",
      "disappointed",
      "broken",
      "disgusting",
      "pathetic",
      "useless",
      "worthless",
      "garbage",
      "trash",
      "nightmare",
      "disaster",
      "catastrophe",
      "failure",
      "failed",
      "failing",
      "sucks",
      "sucked",
      "suck",
      "annoying",
      "frustrating",
      "irritating",
      "infuriating",
      "outrageous",
      "ridiculous",
      "stupid",
      "dumb",
      "idiotic",
      "moronic",
      "absurd",
      "nonsense",
      "waste",
      "wasted",
      "regret",
      "sorry",
      "apologize",
      "refund",
      "return",
      "cancel",
      "cancelled",
      "quit",
      "angry",
      "furious",
      "mad",
      "upset",
      "sad",
      "depressed",
      "miserable",
      "unhappy",
    ]

    const neutralWords = [
      "okay",
      "ok",
      "fine",
      "average",
      "normal",
      "standard",
      "typical",
      "usual",
      "regular",
      "decent",
      "acceptable",
      "adequate",
      "sufficient",
      "moderate",
      "fair",
      "reasonable",
    ]

    // Count word occurrences with weighted scoring
    let positiveScore = 0
    let negativeScore = 0
    let neutralScore = 0

    positiveWords.forEach((word) => {
      const count = (text.match(new RegExp(word, "g")) || []).length
      positiveScore += count * (word.length > 6 ? 2 : 1) // Longer words get more weight
    })

    negativeWords.forEach((word) => {
      const count = (text.match(new RegExp(word, "g")) || []).length
      negativeScore += count * (word.length > 6 ? 2 : 1)
    })

    neutralWords.forEach((word) => {
      const count = (text.match(new RegExp(word, "g")) || []).length
      neutralScore += count
    })

    // Check for intensifiers
    const intensifiers = [
      "very",
      "extremely",
      "incredibly",
      "absolutely",
      "totally",
      "completely",
      "really",
      "so",
      "quite",
    ]
    let intensifierMultiplier = 1
    intensifiers.forEach((intensifier) => {
      if (text.includes(intensifier)) {
        intensifierMultiplier += 0.2
      }
    })

    // Check for negations
    const negations = [
      "not",
      "no",
      "never",
      "nothing",
      "nobody",
      "nowhere",
      "neither",
      "nor",
      "don't",
      "doesn't",
      "didn't",
      "won't",
      "wouldn't",
      "can't",
      "cannot",
      "couldn't",
      "shouldn't",
      "mustn't",
    ]
    let hasNegation = false
    negations.forEach((negation) => {
      if (text.includes(negation)) {
        hasNegation = true
      }
    })

    // Calculate final sentiment
    if (hasNegation) {
      // Flip the sentiment if negation is present
      if (positiveScore > negativeScore) {
        sentimentScore = -0.4 * intensifierMultiplier
        emotion = "negative"
      } else if (negativeScore > positiveScore) {
        sentimentScore = 0.4 * intensifierMultiplier
        emotion = "positive"
      }
    } else {
      if (positiveScore > negativeScore && positiveScore > neutralScore) {
        sentimentScore = Math.min(
          0.9,
          (positiveScore / (positiveScore + negativeScore + neutralScore)) * intensifierMultiplier,
        )
        emotion = "positive"
      } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
        sentimentScore = -Math.min(
          0.9,
          (negativeScore / (positiveScore + negativeScore + neutralScore)) * intensifierMultiplier,
        )
        emotion = "negative"
      } else if (positiveScore > 0 && negativeScore > 0) {
        sentimentScore = ((positiveScore - negativeScore) / (positiveScore + negativeScore)) * 0.3
        emotion = "mixed"
      } else {
        sentimentScore = 0
        emotion = "neutral"
      }
    }

    // Analyze brand relevance
    let brandRelevance = 0.5
    const brandKeywordMatches = brandKeywords?.filter((keyword: string) => text.includes(keyword.toLowerCase())) || []
    brandRelevance = Math.min(1, 0.5 + brandKeywordMatches.length * 0.2)

    // Analyze competitor mentions
    const competitorMentioned =
      competitorKeywords?.some((keyword: string) => text.includes(keyword.toLowerCase())) || false

    // Determine priority based on sentiment and engagement
    let priority: "low" | "medium" | "high" | "critical" = "medium"
    if (Math.abs(sentimentScore) > 0.7 || mention.viralPotential > 0.8) {
      priority = "critical"
    } else if (Math.abs(sentimentScore) > 0.5 || mention.viralPotential > 0.6) {
      priority = "high"
    } else if (Math.abs(sentimentScore) > 0.3) {
      priority = "medium"
    } else {
      priority = "low"
    }

    // Determine category
    let category: "product" | "service" | "brand" | "campaign" | "crisis" | "opportunity" = "brand"
    if (text.includes("product") || text.includes("feature") || text.includes("update")) {
      category = "product"
    } else if (text.includes("service") || text.includes("support") || text.includes("help")) {
      category = "service"
    } else if (text.includes("campaign") || text.includes("ad") || text.includes("marketing")) {
      category = "campaign"
    } else if (text.includes("down") || text.includes("broken") || text.includes("issue") || text.includes("problem")) {
      category = "crisis"
    } else if (
      sentimentScore > 0.5 &&
      (text.includes("recommend") || text.includes("switch") || text.includes("try"))
    ) {
      category = "opportunity"
    }

    // Calculate viral potential based on engagement and sentiment
    let viralPotential = mention.viralPotential || 0.3
    if (mention.author.influencerTier === "mega" || mention.author.influencerTier === "celebrity") {
      viralPotential = Math.min(1, viralPotential + 0.3)
    }
    if (Math.abs(sentimentScore) > 0.6) {
      viralPotential = Math.min(1, viralPotential + 0.2)
    }

    const fallbackAnalysis = {
      sentimentScore,
      emotion,
      confidence: 0.75 + Math.abs(sentimentScore) * 0.2, // Higher confidence for stronger sentiments
      brandRelevance,
      viralPotential,
      priority,
      category,
      keyTopics: [...(brandKeywordMatches || []), ...(competitorMentioned ? ["competitor analysis"] : []), category],
      competitorMentioned,
      influencerTier: mention.author.influencerTier,
      actionRequired: Math.abs(sentimentScore) > 0.5 || priority === "critical",
      suggestedResponse:
        sentimentScore < -0.5
          ? "Consider reaching out to address concerns and provide support"
          : sentimentScore > 0.7
            ? "Engage positively and consider amplifying this positive mention"
            : undefined,
      reasoning: `Fallback analysis: Found ${positiveScore} positive signals, ${negativeScore} negative signals. ${hasNegation ? "Negation detected. " : ""}Sentiment: ${emotion} (${sentimentScore.toFixed(2)}). Priority: ${priority} based on sentiment strength and viral potential.`,
    }

    // Enhanced JSON output for brand monitoring systems
    const brandAnalysisOutput = {
      mentionId: mention.id,
      timestamp: new Date().toISOString(),
      platform: mention.platform,
      author: {
        username: mention.author.username,
        displayName: mention.author.displayName,
        followers: mention.author.followers,
        verified: mention.author.verified,
        influencerTier: mention.author.influencerTier,
      },
      content: {
        text: mention.content.text,
        url: mention.content.url,
        hashtags: mention.hashtags,
        mentions: mention.mentions || [],
      },
      metrics: mention.metrics,
      analysis: {
        sentiment: {
          score: fallbackAnalysis.sentimentScore,
          emotion: fallbackAnalysis.emotion,
          confidence: fallbackAnalysis.confidence,
          reasoning: fallbackAnalysis.reasoning,
        },
        brand: {
          relevance: fallbackAnalysis.brandRelevance,
          priority: fallbackAnalysis.priority,
          category: fallbackAnalysis.category,
          keyTopics: fallbackAnalysis.keyTopics,
        },
        viral: {
          potential: fallbackAnalysis.viralPotential,
          currentEngagement: mention.metrics.engagement,
          reachPotential: mention.metrics.reach,
        },
        competitive: {
          competitorMentioned: fallbackAnalysis.competitorMentioned,
          brandKeywordsFound: brandKeywordMatches,
          competitorKeywordsFound:
            competitorKeywords?.filter((keyword: string) =>
              mention.content.text.toLowerCase().includes(keyword.toLowerCase()),
            ) || [],
        },
        actionable: {
          actionRequired: fallbackAnalysis.actionRequired,
          suggestedResponse: fallbackAnalysis.suggestedResponse,
          urgency: fallbackAnalysis.priority,
        },
      },
      processing: {
        timestamp: new Date().toISOString(),
        model: "enhanced-fallback-analysis",
        version: "2.0",
        processed: true,
        method: "keyword-based-sentiment-analysis",
      },
    }

    console.log("🔍 BRAND MENTION ANALYZED (FALLBACK):", JSON.stringify(brandAnalysisOutput, null, 2))

    return NextResponse.json({
      sentimentScore: fallbackAnalysis.sentimentScore,
      emotion: fallbackAnalysis.emotion,
      confidence: fallbackAnalysis.confidence,
      reasoning: fallbackAnalysis.reasoning,
    })
  } catch (error) {
    console.error("Brand mention analysis error:", error)

    // Return a safe fallback response
    return NextResponse.json({
      sentimentScore: 0,
      emotion: "neutral",
      confidence: 0.5,
      reasoning: "Analysis failed, using neutral fallback due to processing error",
    })
  }
}
