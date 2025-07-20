import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keywords = searchParams.get("keywords")?.split(",") || []

    console.log("🐦 TWITTER STREAM REQUEST:", {
      keywords,
      timestamp: new Date().toISOString(),
      hasTwitterApiKey: !!process.env.TWITTER_API_KEY,
    })

    // Check if Twitter API credentials are available
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
      console.log("Twitter API credentials not found, using simulated data")

      // Return simulated Twitter data
      const simulatedTweets = [
        {
          id: "tweet_" + Math.random().toString(36).substr(2, 9),
          text: `Just tried @YourBrand's new product and I'm absolutely blown away! The quality is incredible. #YourBrand #ProductReview`,
          author: {
            username: "tech_enthusiast",
            name: "Tech Enthusiast",
            followers_count: 15000,
            verified: false,
            profile_image_url: "/placeholder.svg?height=40&width=40&text=TE",
          },
          public_metrics: {
            like_count: 45,
            retweet_count: 12,
            reply_count: 8,
            quote_count: 3,
          },
          created_at: new Date().toISOString(),
          lang: "en",
          context_annotations: [
            {
              domain: { name: "Brand" },
              entity: { name: "YourBrand" },
            },
          ],
        },
        {
          id: "tweet_" + Math.random().toString(36).substr(2, 9),
          text: `Having issues with @YourBrand's service today. Support team hasn't responded yet. #CustomerService #Help`,
          author: {
            username: "frustrated_user",
            name: "John Customer",
            followers_count: 500,
            verified: false,
            profile_image_url: "/placeholder.svg?height=40&width=40&text=JC",
          },
          public_metrics: {
            like_count: 8,
            retweet_count: 2,
            reply_count: 15,
            quote_count: 1,
          },
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          lang: "en",
          context_annotations: [
            {
              domain: { name: "Brand" },
              entity: { name: "YourBrand" },
            },
          ],
        },
      ]

      return NextResponse.json({
        data: simulatedTweets,
        meta: {
          result_count: simulatedTweets.length,
          newest_id: simulatedTweets[0]?.id,
          oldest_id: simulatedTweets[simulatedTweets.length - 1]?.id,
        },
        simulated: true,
        message: "Using simulated Twitter data - add Twitter API credentials for real data",
      })
    }

    // Real Twitter API implementation
    try {
      const twitterApiUrl = "https://api.twitter.com/2/tweets/search/recent"
      const query = keywords.map((k) => `"${k}"`).join(" OR ")

      const response = await fetch(
        `${twitterApiUrl}?query=${encodeURIComponent(query)}&max_results=10&tweet.fields=created_at,author_id,public_metrics,lang,context_annotations&user.fields=username,name,verified,public_metrics,profile_image_url&expansions=author_id`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.status}`)
      }

      const twitterData = await response.json()

      console.log("✅ TWITTER DATA FETCHED:", {
        resultCount: twitterData.meta?.result_count || 0,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json(twitterData)
    } catch (twitterError) {
      console.error("Twitter API error:", twitterError)

      // Fallback to simulated data if Twitter API fails
      const fallbackTweets = [
        {
          id: "fallback_" + Math.random().toString(36).substr(2, 9),
          text: `Loving the new features from @YourBrand! The user experience is so much better now. #Innovation #TechUpdate`,
          author: {
            username: "beta_tester",
            name: "Beta Tester Pro",
            followers_count: 8500,
            verified: true,
            profile_image_url: "/placeholder.svg?height=40&width=40&text=BT",
          },
          public_metrics: {
            like_count: 67,
            retweet_count: 23,
            reply_count: 12,
            quote_count: 5,
          },
          created_at: new Date().toISOString(),
          lang: "en",
        },
      ]

      return NextResponse.json({
        data: fallbackTweets,
        meta: {
          result_count: fallbackTweets.length,
          newest_id: fallbackTweets[0]?.id,
          oldest_id: fallbackTweets[fallbackTweets.length - 1]?.id,
        },
        fallback: true,
        message: "Twitter API unavailable - using fallback data",
      })
    }
  } catch (error) {
    console.error("Twitter stream error:", error)
    return NextResponse.json({ error: "Failed to fetch Twitter data" }, { status: 500 })
  }
}
