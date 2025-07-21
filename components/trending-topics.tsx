"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Hash, Flame, Eye, MessageCircle, Share } from "lucide-react"

interface BrandMention {
  hashtags: string[]
  content: {
    text: string
  }
  metrics: {
    likes: number
    shares: number
    comments: number
    views: number
    engagement: number
  }
  timestamp: Date
  viralPotential: number
  platform: string
  author: {
    displayName: string
    followers: number
  }
}

interface TrendingTopicsProps {
  mentions: BrandMention[]
}

export function TrendingTopics({ mentions }: TrendingTopicsProps) {
  // Analyze hashtags
  const hashtagAnalysis = mentions.reduce((acc, mention) => {
    mention.hashtags.forEach((hashtag) => {
      if (!acc[hashtag]) {
        acc[hashtag] = {
          tag: hashtag,
          count: 0,
          totalEngagement: 0,
          totalReach: 0,
          platforms: new Set(),
          recentMentions: [],
          viralPotential: 0,
        }
      }
      acc[hashtag].count += 1
      acc[hashtag].totalEngagement += mention.metrics.engagement
      acc[hashtag].totalReach += mention.metrics.views
      acc[hashtag].platforms.add(mention.platform)
      acc[hashtag].viralPotential = Math.max(acc[hashtag].viralPotential, mention.viralPotential)

      if (acc[hashtag].recentMentions.length < 3) {
        acc[hashtag].recentMentions.push({
          text: mention.content.text,
          author: mention.author.displayName,
          engagement: mention.metrics.engagement,
          timestamp: mention.timestamp,
        })
      }
    })
    return acc
  }, {} as any)

  // Sort hashtags by trending score (count * engagement * viral potential)
  const trendingHashtags = Object.values(hashtagAnalysis)
    .map((hashtag: any) => ({
      ...hashtag,
      trendingScore: hashtag.count * (hashtag.totalEngagement / hashtag.count) * (hashtag.viralPotential + 0.1),
      averageEngagement: hashtag.totalEngagement / hashtag.count,
      platformCount: hashtag.platforms.size,
    }))
    .sort((a: any, b: any) => b.trendingScore - a.trendingScore)

  // Analyze keywords from content
  const keywordAnalysis = mentions.reduce((acc, mention) => {
    const words = mention.content.text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 3 &&
          ![
            "this",
            "that",
            "with",
            "have",
            "will",
            "been",
            "from",
            "they",
            "know",
            "want",
            "been",
            "good",
            "much",
            "some",
            "time",
            "very",
            "when",
            "come",
            "here",
            "just",
            "like",
            "long",
            "make",
            "many",
            "over",
            "such",
            "take",
            "than",
            "them",
            "well",
            "were",
          ].includes(word),
      )

    words.forEach((word) => {
      if (!acc[word]) {
        acc[word] = {
          word,
          count: 0,
          sentiment: 0,
          engagement: 0,
        }
      }
      acc[word].count += 1
      acc[word].engagement += mention.metrics.engagement
    })
    return acc
  }, {} as any)

  const trendingKeywords = Object.values(keywordAnalysis)
    .filter((keyword: any) => keyword.count >= 2)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10)

  // Viral content analysis
  const viralContent = mentions
    .filter((mention) => mention.viralPotential > 0.7)
    .sort((a, b) => b.viralPotential - a.viralPotential)
    .slice(0, 5)

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
      {/* Trending Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending Hashtags</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trendingHashtags.length}</div>
            <p className="text-xs text-muted-foreground">Active hashtags</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viral Posts</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{viralContent.length}</div>
            <p className="text-xs text-muted-foreground">High viral potential</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {trendingHashtags.length > 0 ? Math.round(trendingHashtags[0].averageEngagement) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Avg per hashtag</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cross-Platform</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {trendingHashtags.filter((h: any) => h.platformCount > 1).length}
            </div>
            <p className="text-xs text-muted-foreground">Multi-platform tags</p>
          </CardContent>
        </Card>
      </div>

      {/* Trending Hashtags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Trending Hashtags
          </CardTitle>
          <CardDescription>Most popular hashtags related to your brand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingHashtags.slice(0, 10).map((hashtag: any, index) => (
              <div key={hashtag.tag} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{hashtag.tag}</h3>
                      <p className="text-sm text-muted-foreground">
                        {hashtag.count} mentions • {hashtag.platformCount} platforms
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hashtag.viralPotential > 0.7 && (
                      <Badge variant="destructive" className="animate-pulse">
                        <Flame className="h-3 w-3 mr-1" />
                        Viral
                      </Badge>
                    )}
                    <Badge variant="outline">{Math.round(hashtag.trendingScore)} trend score</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{hashtag.count}</div>
                    <div className="text-xs text-muted-foreground">Mentions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{Math.round(hashtag.averageEngagement)}</div>
                    <div className="text-xs text-muted-foreground">Avg Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{(hashtag.totalReach / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-muted-foreground">Total Reach</div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Trending Score</span>
                    <span>{Math.round(hashtag.trendingScore).toLocaleString()}</span>
                  </div>
                  <Progress
                    value={Math.min(100, (hashtag.trendingScore / (trendingHashtags[0]?.trendingScore || 1)) * 100)}
                    className="h-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from(hashtag.platforms).map((platform: string) => (
                      <span key={platform} className="text-sm">
                        {getPlatformIcon(platform)}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    Track Hashtag
                  </Button>
                </div>

                {hashtag.recentMentions.length > 0 && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Recent mention:</p>
                    <p className="text-sm line-clamp-2">"{hashtag.recentMentions[0].text.substring(0, 100)}..."</p>
                    <p className="text-xs text-muted-foreground mt-1">by {hashtag.recentMentions[0].author}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Viral Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Viral Content Alert
          </CardTitle>
          <CardDescription>Posts with high viral potential that need attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {viralContent.map((mention, index) => (
              <div key={index} className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-950 border-orange-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white font-bold">
                      {mention.author.displayName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{mention.author.displayName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {mention.author.followers.toLocaleString()} followers • {getPlatformIcon(mention.platform)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="animate-pulse">
                    <Flame className="h-3 w-3 mr-1" />
                    {(mention.viralPotential * 100).toFixed(0)}% Viral
                  </Badge>
                </div>

                <p className="text-sm mb-3 leading-relaxed">{mention.content.text}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {mention.metrics.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share className="h-4 w-4" />
                      {mention.metrics.shares.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {mention.metrics.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Monitor
                    </Button>
                    <Button variant="outline" size="sm">
                      Respond
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {viralContent.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Flame className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No viral content detected</p>
                <p className="text-sm">Posts with high engagement will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trending Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Keywords</CardTitle>
          <CardDescription>Most frequently mentioned words in brand conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingKeywords.map((keyword: any, index) => (
              <Badge key={keyword.word} variant="outline" className="text-sm px-3 py-1 hover:bg-muted cursor-pointer">
                {keyword.word} ({keyword.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
