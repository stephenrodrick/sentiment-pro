"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Star, TrendingUp, Users, MessageCircle, Heart, Eye, CheckCircle, ExternalLink, Flame } from "lucide-react"

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
    images?: string[]
    videos?: string[]
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
  viralPotential: number
}

interface InfluencerProfile {
  id: string
  username: string
  displayName: string
  platform: string
  followers: number
  following: number
  posts: number
  engagement: number
  tier: "nano" | "micro" | "macro" | "mega" | "celebrity"
  niche: string[]
  location: string
  verified: boolean
  profileImage: string
  bio: string
  recentMentions: number
  sentimentScore: number
  brandAffinity: number
  collaborationHistory: boolean
  lastActive: Date
  trending: boolean
}

interface InfluencerTrackerProps {
  mentions: BrandMention[]
}

export function InfluencerTracker({ mentions }: InfluencerTrackerProps) {
  // Process mentions to extract influencer data
  const influencerData = mentions
    .filter((mention) => mention.author.influencerTier !== "nano")
    .reduce(
      (acc, mention) => {
        const key = `${mention.author.username}-${mention.platform}`
        if (!acc[key]) {
          acc[key] = {
            id: key,
            username: mention.author.username,
            displayName: mention.author.displayName,
            platform: mention.platform,
            followers: mention.author.followers,
            following: Math.floor(mention.author.followers * 0.1),
            posts: Math.floor(Math.random() * 1000) + 100,
            engagement: mention.metrics.engagement,
            tier: mention.author.influencerTier,
            niche: ["technology", "lifestyle", "business"][Math.floor(Math.random() * 3)],
            location: ["Chennai", "Mumbai", "Delhi", "Bangalore"][Math.floor(Math.random() * 4)],
            verified: mention.author.verified,
            profileImage: mention.author.profileImage,
            bio: `${mention.author.displayName} - Content creator and influencer`,
            recentMentions: 1,
            sentimentScore: mention.sentiment.score,
            brandAffinity: Math.random() * 100,
            collaborationHistory: Math.random() > 0.7,
            lastActive: mention.timestamp,
            trending: mention.viralPotential > 0.7,
          }
        } else {
          acc[key].recentMentions += 1
          acc[key].sentimentScore = (acc[key].sentimentScore + mention.sentiment.score) / 2
          acc[key].engagement = Math.max(acc[key].engagement, mention.metrics.engagement)
          if (mention.timestamp > acc[key].lastActive) {
            acc[key].lastActive = mention.timestamp
          }
        }
        return acc
      },
      {} as Record<string, InfluencerProfile>,
    )

  const influencers = Object.values(influencerData).sort((a, b) => b.followers - a.followers)

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "celebrity":
        return "bg-red-100 text-red-800 border-red-200"
      case "mega":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "macro":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "micro":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "celebrity":
        return "👑"
      case "mega":
        return "🌟"
      case "macro":
        return "⭐"
      case "micro":
        return "✨"
      default:
        return "💫"
    }
  }

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return "text-green-600"
    if (score < -0.3) return "text-red-600"
    return "text-yellow-600"
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

  // Calculate summary stats
  const totalInfluencers = influencers.length
  const totalReach = influencers.reduce((sum, inf) => sum + inf.followers, 0)
  const averageSentiment =
    influencers.length > 0 ? influencers.reduce((sum, inf) => sum + inf.sentimentScore, 0) / influencers.length : 0
  const trendingInfluencers = influencers.filter((inf) => inf.trending).length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{totalInfluencers}</div>
            <p className="text-xs text-purple-600 mt-1">Active brand mentions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{(totalReach / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-blue-600 mt-1">Combined followers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sentiment</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{averageSentiment.toFixed(2)}</div>
            <p className="text-xs text-green-600 mt-1">Overall brand sentiment</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{trendingInfluencers}</div>
            <p className="text-xs text-orange-600 mt-1">Viral potential posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Influencer List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Influencer Activity Dashboard
          </CardTitle>
          <CardDescription>
            Track influencers who have mentioned your brand, sorted by reach and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {influencers.slice(0, 10).map((influencer) => (
              <div
                key={influencer.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={influencer.profileImage || "/placeholder.svg"} alt={influencer.displayName} />
                    <AvatarFallback>{influencer.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{influencer.displayName}</h3>
                      {influencer.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      {influencer.trending && (
                        <Badge variant="destructive" className="animate-pulse">
                          <Flame className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {getPlatformIcon(influencer.platform)} @{influencer.username}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {influencer.followers.toLocaleString()} followers
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {influencer.recentMentions} mentions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge className={getTierColor(influencer.tier)}>
                      {getTierIcon(influencer.tier)} {influencer.tier.toUpperCase()}
                    </Badge>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Sentiment:</span>
                        <span className={`font-medium ${getSentimentColor(influencer.sentimentScore)}`}>
                          {influencer.sentimentScore.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Engagement:</span>
                        <span className="font-medium">{influencer.engagement.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Profile
                    </Button>
                    {influencer.collaborationHistory ? (
                      <Badge variant="secondary" className="w-full justify-center">
                        Past Collaborator
                      </Badge>
                    ) : (
                      <Button size="sm" variant="default" className="w-full">
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {influencers.length === 0 && (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Influencers Found</h3>
              <p className="text-muted-foreground">Start monitoring to discover influencers mentioning your brand</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Influencer Tier Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Influencer Tier Distribution</CardTitle>
            <CardDescription>Breakdown of influencers by tier and reach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["celebrity", "mega", "macro", "micro"].map((tier) => {
                const tierInfluencers = influencers.filter((inf) => inf.tier === tier)
                const percentage = influencers.length > 0 ? (tierInfluencers.length / influencers.length) * 100 : 0

                return (
                  <div key={tier} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{getTierIcon(tier)}</span>
                        <span className="font-medium capitalize">{tier}</span>
                        <Badge variant="outline" className="text-xs">
                          {tierInfluencers.length}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Influencers</CardTitle>
            <CardDescription>Highest engagement and positive sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {influencers
                .filter((inf) => inf.sentimentScore > 0.3)
                .sort((a, b) => b.engagement - a.engagement)
                .slice(0, 5)
                .map((influencer, index) => (
                  <div key={influencer.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={influencer.profileImage || "/placeholder.svg"} alt={influencer.displayName} />
                      <AvatarFallback className="text-xs">{influencer.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{influencer.displayName}</span>
                        {influencer.verified && <CheckCircle className="h-3 w-3 text-blue-500" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{influencer.followers.toLocaleString()} followers</span>
                        <span className={getSentimentColor(influencer.sentimentScore)}>
                          {influencer.sentimentScore.toFixed(2)} sentiment
                        </span>
                      </div>
                    </div>
                    <Badge className={getTierColor(influencer.tier)} variant="outline">
                      {influencer.tier}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
