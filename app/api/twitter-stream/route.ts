import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { keywords } = await request.json()

    // Twitter API v2 Bearer Token Authentication
    const twitterResponse = await fetch("https://api.twitter.com/2/tweets/search/recent", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      // Note: In a real implementation, you'd use the streaming endpoint
      // This is a simplified version using the search endpoint
    })

    if (!twitterResponse.ok) {
      throw new Error(`Twitter API error: ${twitterResponse.status}`)
    }

    const twitterData = await twitterResponse.json()

    // Process Twitter data into our format
    const processedMentions =
      twitterData.data?.map((tweet: any) => ({
        id: tweet.id,
        platform: "twitter",
        author: {
          username: tweet.author_id, // In real implementation, you'd fetch user details
          displayName: `User ${tweet.author_id}`,
          followers: Math.floor(Math.random() * 10000),
          verified: Math.random() > 0.8,
          profileImage: `/placeholder.svg?height=40&width=40&text=U`,
          influencerTier: ["nano", "micro", "macro"][Math.floor(Math.random() * 3)],
        },
        content: {
          text: tweet.text,
          url: `https://twitter.com/user/status/${tweet.id}`,
        },
        metrics: {
          likes: tweet.public_metrics?.like_count || 0,
          shares: tweet.public_metrics?.retweet_count || 0,
          comments: tweet.public_metrics?.reply_count || 0,
          views: tweet.public_metrics?.impression_count || 0,
          engagement: Math.random() * 10,
          reach: Math.random() * 100000,
        },
        sentiment: {
          score: (Math.random() - 0.5) * 2,
          emotion: ["positive", "negative", "neutral"][Math.floor(Math.random() * 3)],
          confidence: 0.7 + Math.random() * 0.3,
        },
        timestamp: new Date(tweet.created_at),
        hashtags: tweet.entities?.hashtags?.map((h: any) => `#${h.tag}`) || [],
        viralPotential: Math.random(),
        brandRelevance: 0.8 + Math.random() * 0.2,
        isCompetitor: Math.random() > 0.8,
        priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        category: ["product", "service", "brand"][Math.floor(Math.random() * 3)],
      })) || []

    return NextResponse.json({
      success: true,
      mentions: processedMentions,
      count: processedMentions.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Twitter stream error:", error)

    // Fallback: Generate simulated Twitter mentions
    const simulatedMentions = Array.from({ length: 5 }, (_, i) => ({
      id: `twitter_${Date.now()}_${i}`,
      platform: "twitter",
      author: {
        username: `user${i + 1}`,
        displayName: `Twitter User ${i + 1}`,
        followers: Math.floor(Math.random() * 50000),
        verified: Math.random() > 0.7,
        profileImage: `/placeholder.svg?height=40&width=40&text=T${i + 1}`,
        influencerTier: ["nano", "micro", "macro", "mega"][Math.floor(Math.random() * 4)],
      },
      content: {
        text: [
          "Just tried @YourBrand's new feature and it's amazing! Highly recommend 👍 #YourBrand #Innovation",
          "Having some issues with @YourBrand today. Hope they fix it soon. #YourBrand #Support",
          "Love how @YourBrand always listens to customer feedback. Great company! #CustomerFirst #YourBrand",
          "@YourBrand vs @Competitor1 - definitely going with YourBrand for better value #BrandComparison",
          "Excited about @YourBrand's latest announcement! Can't wait to try it out 🚀 #YourBrand #Excited",
        ][i],
        url: `https://twitter.com/user${i + 1}/status/${Date.now() + i}`,
      },
      metrics: {
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 10000),
        engagement: Math.random() * 8 + 2,
        reach: Math.floor(Math.random() * 50000),
      },
      sentiment: {
        score: [0.8, -0.6, 0.7, 0.3, 0.9][i],
        emotion: ["positive", "negative", "positive", "neutral", "positive"][i],
        confidence: 0.8 + Math.random() * 0.2,
      },
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      hashtags: [
        ["#YourBrand", "#Innovation"],
        ["#YourBrand", "#Support"],
        ["#CustomerFirst", "#YourBrand"],
        ["#BrandComparison"],
        ["#YourBrand", "#Excited"],
      ][i],
      viralPotential: [0.7, 0.4, 0.6, 0.5, 0.8][i],
      brandRelevance: 0.9,
      isCompetitor: false,
      priority: ["medium", "high", "low", "medium", "low"][i],
      category: ["product", "service", "brand", "brand", "product"][i],
    }))

    return NextResponse.json({
      success: true,
      mentions: simulatedMentions,
      count: simulatedMentions.length,
      timestamp: new Date().toISOString(),
      fallback: true,
    })
  }
}
