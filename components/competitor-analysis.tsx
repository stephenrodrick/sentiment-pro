"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  MessageCircle,
  Share,
  Eye,
  Target,
  AlertTriangle,
  CheckCircle,
  Minus,
} from "lucide-react"

interface BrandMention {
  id: string
  platform: "twitter" | "instagram" | "facebook" | "linkedin" | "tiktok" | "youtube" | "reddit" | "news"
  author: {
    username: string
    displayName: string
    followers: number
    verified: boolean
    profileImage: string
    influencerTier: "nano" | "micro" | "macro" | "mega" | "celebrity"
  }
  content: {
    text: string
    url: string
  }
  metrics: {
    likes: number
    shares: number
    comments: number
    views: number
    engagement: number
    reach: number
  }
  sentiment: {
    score: number
    emotion: "positive" | "negative" | "neutral" | "mixed"
    confidence: number
  }
  timestamp: Date
  isCompetitor: boolean
  competitorBrand?: string
  hashtags: string[]
}

interface CompetitorData {
  brand: string
  mentions: number
  sentiment: number
  engagement: number
  reach: number
  shareOfVoice: number
  topPosts: BrandMention[]
  trendingHashtags: string[]
  influencerCollaborations: number
  campaignActivity: boolean
  growth: number
}

interface CompetitorAnalysisProps {
  mentions: BrandMention[]
  competitors: string[]
}

export function CompetitorAnalysis({ mentions, competitors }: CompetitorAnalysisProps) {
  // Process competitor data
  const competitorData: CompetitorData[] = competitors.map((competitor) => {
    const competitorMentions = mentions.filter(
      (mention) =>
        (mention.isCompetitor && mention.competitorBrand === competitor) ||
        mention.content.text.toLowerCase().includes(competitor.toLowerCase()),
    )

    const totalMentions = competitorMentions.length
    const averageSentiment =
      totalMentions > 0 ? competitorMentions.reduce((sum, m) => sum + m.sentiment.score, 0) / totalMentions : 0
    const totalEngagement = competitorMentions.reduce((sum, m) => sum + m.metrics.engagement, 0)
    const totalReach = competitorMentions.reduce((sum, m) => sum + m.metrics.reach, 0)
    const influencerMentions = competitorMentions.filter(
      (m) =>
        m.author.influencerTier === "macro" ||
        m.author.influencerTier === "mega" ||
        m.author.influencerTier === "celebrity",
    ).length

    // Extract hashtags
    const hashtags = competitorMentions.flatMap((m) => m.hashtags)
    const hashtagCounts = hashtags.reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const trendingHashtags = Object.entries(hashtagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)

    return {
      brand: competitor,
      mentions: totalMentions,
      sentiment: averageSentiment,
      engagement: totalEngagement / Math.max(totalMentions, 1),
      reach: totalReach,
      shareOfVoice: Math.random() * 25 + 5, // Simulated
      topPosts: competitorMentions.sort((a, b) => b.metrics.engagement - a.metrics.engagement).slice(0, 3),
      trendingHashtags,
      influencerCollaborations: influencerMentions,
      campaignActivity: Math.random() > 0.5,
      growth: (Math.random() - 0.5) * 20, // -10% to +10%
    }
  })

  // Add your brand data for comparison
  const yourBrandMentions = mentions.filter((m) => !m.isCompetitor)
  const yourBrandData: CompetitorData = {
    brand: "Your Brand",
    mentions: yourBrandMentions.length,
    sentiment:
      yourBrandMentions.length > 0
        ? yourBrandMentions.reduce((sum, m) => sum + m.sentiment.score, 0) / yourBrandMentions.length
        : 0,
    engagement:
      yourBrandMentions.reduce((sum, m) => sum + m.metrics.engagement, 0) / Math.max(yourBrandMentions.length, 1),
    reach: yourBrandMentions.reduce((sum, m) => sum + m.metrics.reach, 0),
    shareOfVoice: Math.random() * 30 + 20, // Simulated
    topPosts: yourBrandMentions.sort((a, b) => b.metrics.engagement - a.metrics.engagement).slice(0, 3),
    trendingHashtags: [],
    influencerCollaborations: yourBrandMentions.filter(
      (m) =>
        m.author.influencerTier === "macro" ||
        m.author.influencerTier === "mega" ||
        m.author.influencerTier === "celebrity",
    ).length,
    campaignActivity: true,
    growth: Math.random() * 15 + 5, // 5% to 20%
  }

  const allBrands = [yourBrandData, ...competitorData].sort((a, b) => b.mentions - a.mentions)

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return "text-green-600"
    if (score < -0.3) return "text-red-600"
    return "text-yellow-600"
  }

  const getSentimentIcon = (score: number) => {
    if (score > 0.3) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (score < -0.3) return <AlertTriangle className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-yellow-600" />
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getPlatformIcon = (platform: string) => {
    const icons = {
      twitter: "𝕏",
      instagram: "📷",
      facebook: "📘",
      linkedin: "💼",
      tiktok: "🎵",
      youtube: "📺",
      reddit: "🤖",
      news: "📰",
    }
    return icons[platform as keyof typeof icons] || "🌐"
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competitors Tracked</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{competitors.length}</div>
            <p className="text-xs text-blue-600 mt-1">Active monitoring</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Share of Voice</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{yourBrandData.shareOfVoice.toFixed(1)}%</div>
            <p className="text-xs text-purple-600 mt-1">Market presence</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Brand Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{((yourBrandData.sentiment + 1) * 50).toFixed(0)}%</div>
            <p className="text-xs text-green-600 mt-1">Sentiment score</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">+{yourBrandData.growth.toFixed(1)}%</div>
            <p className="text-xs text-orange-600 mt-1">vs last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Competitive Landscape Analysis
          </CardTitle>
          <CardDescription>Compare your brand performance against key competitors across all metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allBrands.map((brand, index) => (
              <div
                key={brand.brand}
                className={`p-4 rounded-lg border ${
                  brand.brand === "Your Brand"
                    ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                    : "bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        brand.brand === "Your Brand" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{brand.brand}</h3>
                      {brand.brand === "Your Brand" && (
                        <Badge variant="default" className="mt-1">
                          Your Brand
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(brand.sentiment)}
                    {getGrowthIcon(brand.growth)}
                    {brand.campaignActivity && (
                      <Badge variant="outline" className="text-xs">
                        Active Campaign
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{brand.mentions}</div>
                    <div className="text-xs text-muted-foreground">Mentions</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getSentimentColor(brand.sentiment)}`}>
                      {brand.sentiment.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">Sentiment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{brand.engagement.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{(brand.reach / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-muted-foreground">Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{brand.shareOfVoice.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Share of Voice</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{brand.influencerCollaborations}</div>
                    <div className="text-xs text-muted-foreground">Influencers</div>
                  </div>
                </div>

                {/* Share of Voice Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Market Share</span>
                    <span className="text-sm text-muted-foreground">{brand.shareOfVoice.toFixed(1)}%</span>
                  </div>
                  <Progress value={brand.shareOfVoice} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="content">Top Content</TabsTrigger>
          <TabsTrigger value="hashtags">Trending Tags</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Comparison</CardTitle>
                <CardDescription>Brand sentiment scores across competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allBrands.map((brand) => (
                    <div key={brand.brand} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{brand.brand}</span>
                        <span className={`font-bold ${getSentimentColor(brand.sentiment)}`}>
                          {brand.sentiment.toFixed(2)}
                        </span>
                      </div>
                      <Progress value={((brand.sentiment + 1) / 2) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Rates</CardTitle>
                <CardDescription>Average engagement across all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allBrands.map((brand) => (
                    <div key={brand.brand} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{brand.brand}</span>
                        <span className="font-bold text-blue-600">{brand.engagement.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(brand.engagement * 10, 100)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allBrands.slice(0, 2).map((brand) => (
              <Card key={brand.brand}>
                <CardHeader>
                  <CardTitle>{brand.brand} - Top Performing Content</CardTitle>
                  <CardDescription>Highest engagement posts and mentions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {brand.topPosts.length > 0 ? (
                      brand.topPosts.map((post) => (
                        <div key={post.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                              <span className="font-medium">{post.author.displayName}</span>
                              {post.author.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {post.metrics.engagement.toFixed(1)}% engagement
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.content.text}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {post.metrics.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share className="h-3 w-3" />
                              {post.metrics.shares.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.metrics.views.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent content available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hashtags">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {allBrands.slice(0, 3).map((brand) => (
              <Card key={brand.brand}>
                <CardHeader>
                  <CardTitle>{brand.brand}</CardTitle>
                  <CardDescription>Trending hashtags and topics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {brand.trendingHashtags.length > 0 ? (
                      brand.trendingHashtags.map((hashtag, index) => (
                        <div key={hashtag} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="font-medium">{hashtag}</span>
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No trending hashtags</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competitive Insights</CardTitle>
                <CardDescription>Key observations and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Strengths</h4>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Higher engagement rate than 2 competitors</li>
                      <li>• Positive sentiment trend (+15% this month)</li>
                      <li>• Strong influencer collaboration network</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h4 className="font-semibold text-orange-800">Opportunities</h4>
                    </div>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Increase share of voice on TikTok platform</li>
                      <li>• Target competitor's hashtag strategies</li>
                      <li>• Expand into emerging market segments</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold text-red-800">Threats</h4>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Competitor1 gaining market share rapidly</li>
                      <li>• Lower mention volume in key demographics</li>
                      <li>• Need to address negative sentiment spikes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>Strategic recommendations based on analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Increase Content Frequency</h4>
                      <Badge variant="default">High Priority</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Competitors are posting 3x more content. Increase posting frequency to maintain visibility.
                    </p>
                    <Button size="sm" variant="outline">
                      Create Content Calendar
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Influencer Partnerships</h4>
                      <Badge variant="secondary">Medium Priority</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Identify and collaborate with micro-influencers in your niche for better engagement.
                    </p>
                    <Button size="sm" variant="outline">
                      Find Influencers
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Sentiment Monitoring</h4>
                      <Badge variant="outline">Ongoing</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Set up alerts for negative sentiment spikes to respond quickly to issues.
                    </p>
                    <Button size="sm" variant="outline">
                      Configure Alerts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
