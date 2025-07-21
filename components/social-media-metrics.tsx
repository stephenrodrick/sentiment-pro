"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, MessageCircle, Share, Eye, Heart, Hash, Calendar } from "lucide-react"

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
  hashtags: string[]
}

interface SocialMediaMetricsProps {
  mentions: BrandMention[]
}

export function SocialMediaMetrics({ mentions }: SocialMediaMetricsProps) {
  // Process platform data
  const platformData = mentions.reduce(
    (acc, mention) => {
      const platform = mention.platform
      if (!acc[platform]) {
        acc[platform] = {
          name: platform,
          mentions: 0,
          totalLikes: 0,
          totalShares: 0,
          totalComments: 0,
          totalViews: 0,
          totalReach: 0,
          averageSentiment: 0,
          sentimentSum: 0,
          engagement: 0,
        }
      }

      acc[platform].mentions += 1
      acc[platform].totalLikes += mention.metrics.likes
      acc[platform].totalShares += mention.metrics.shares
      acc[platform].totalComments += mention.metrics.comments
      acc[platform].totalViews += mention.metrics.views
      acc[platform].totalReach += mention.metrics.reach
      acc[platform].sentimentSum += mention.sentiment.score
      acc[platform].engagement += mention.metrics.engagement

      return acc
    },
    {} as Record<string, any>,
  )

  // Calculate averages and format data
  const platformMetrics = Object.values(platformData)
    .map((platform: any) => ({
      ...platform,
      averageSentiment: platform.mentions > 0 ? platform.sentimentSum / platform.mentions : 0,
      averageEngagement: platform.mentions > 0 ? platform.engagement / platform.mentions : 0,
      displayName: platform.name.charAt(0).toUpperCase() + platform.name.slice(1),
    }))
    .sort((a, b) => b.mentions - a.mentions)

  // Time series data for the last 7 days
  const timeSeriesData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))

    const dayMentions = mentions.filter((mention) => {
      const mentionDate = new Date(mention.timestamp)
      return mentionDate.toDateString() === date.toDateString()
    })

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      mentions: dayMentions.length,
      engagement: dayMentions.reduce((sum, m) => sum + m.metrics.engagement, 0) / Math.max(dayMentions.length, 1),
      sentiment: dayMentions.reduce((sum, m) => sum + m.sentiment.score, 0) / Math.max(dayMentions.length, 1),
      reach: dayMentions.reduce((sum, m) => sum + m.metrics.reach, 0),
    }
  })

  // Engagement type distribution
  const engagementData = [
    {
      name: "Likes",
      value: mentions.reduce((sum, m) => sum + m.metrics.likes, 0),
      color: "#ef4444",
    },
    {
      name: "Shares",
      value: mentions.reduce((sum, m) => sum + m.metrics.shares, 0),
      color: "#3b82f6",
    },
    {
      name: "Comments",
      value: mentions.reduce((sum, m) => sum + m.metrics.comments, 0),
      color: "#10b981",
    },
    {
      name: "Views",
      value: mentions.reduce((sum, m) => sum + m.metrics.views, 0) / 100, // Scale down for visualization
      color: "#f59e0b",
    },
  ]

  // Top hashtags
  const hashtagCounts = mentions
    .flatMap((m) => m.hashtags)
    .reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  const topHashtags = Object.entries(hashtagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }))

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

  const getPlatformColor = (platform: string) => {
    const colors = {
      twitter: "#1da1f2",
      instagram: "#e4405f",
      facebook: "#1877f2",
      linkedin: "#0077b5",
      tiktok: "#000000",
      youtube: "#ff0000",
      reddit: "#ff4500",
      news: "#6b7280",
    }
    return colors[platform as keyof typeof colors] || "#6b7280"
  }

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return "#10b981"
    if (score < -0.3) return "#ef4444"
    return "#f59e0b"
  }

  return (
    <div className="space-y-6">
      {/* Platform Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Platforms</CardTitle>
            <Hash className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{platformMetrics.length}</div>
            <p className="text-xs text-blue-600 mt-1">Active monitoring</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {(
                mentions.reduce((sum, m) => sum + m.metrics.likes + m.metrics.shares + m.metrics.comments, 0) / 1000
              ).toFixed(1)}
              K
            </div>
            <p className="text-xs text-green-600 mt-1">Likes, shares, comments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {(mentions.reduce((sum, m) => sum + m.metrics.reach, 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-purple-600 mt-1">Potential impressions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {(mentions.reduce((sum, m) => sum + m.metrics.engagement, 0) / Math.max(mentions.length, 1)).toFixed(1)}%
            </div>
            <p className="text-xs text-orange-600 mt-1">Engagement rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Platform Performance Overview
          </CardTitle>
          <CardDescription>Mentions and engagement metrics across all social media platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="displayName" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [typeof value === "number" ? value.toLocaleString() : value, name]}
                />
                <Bar dataKey="mentions" fill="#8884d8" name="Mentions" />
                <Bar dataKey="averageEngagement" fill="#82ca9d" name="Avg Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Platform Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {platformMetrics.slice(0, 6).map((platform) => (
          <Card key={platform.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{getPlatformIcon(platform.name)}</span>
                <span className="capitalize">{platform.displayName}</span>
              </CardTitle>
              <CardDescription>
                {platform.mentions} mentions • {platform.averageEngagement.toFixed(1)}% avg engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span className="text-muted-foreground">Likes</span>
                    </div>
                    <div className="font-semibold">{platform.totalLikes.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Share className="h-3 w-3 text-blue-500" />
                      <span className="text-muted-foreground">Shares</span>
                    </div>
                    <div className="font-semibold">{platform.totalShares.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-green-500" />
                      <span className="text-muted-foreground">Comments</span>
                    </div>
                    <div className="font-semibold">{platform.totalComments.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-purple-500" />
                      <span className="text-muted-foreground">Views</span>
                    </div>
                    <div className="font-semibold">{(platform.totalViews / 1000).toFixed(1)}K</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sentiment Score</span>
                    <span className="font-semibold" style={{ color: getSentimentColor(platform.averageSentiment) }}>
                      {platform.averageSentiment.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={((platform.averageSentiment + 1) / 2) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Engagement Rate</span>
                    <span className="font-semibold text-orange-600">{platform.averageEngagement.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(platform.averageEngagement * 10, 100)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time Series and Engagement Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              7-Day Trend Analysis
            </CardTitle>
            <CardDescription>Daily mentions and engagement over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="mentions"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    name="Mentions"
                  />
                  <Line type="monotone" dataKey="engagement" stroke="#82ca9d" name="Avg Engagement %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
            <CardDescription>Breakdown of engagement types across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Hashtags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Trending Hashtags
          </CardTitle>
          <CardDescription>Most frequently used hashtags in brand mentions</CardDescription>
        </CardHeader>
        <CardContent>
          {topHashtags.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {topHashtags.map((hashtag, index) => (
                <div
                  key={hashtag.tag}
                  className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="text-2xl font-bold text-purple-600 mb-1">#{index + 1}</div>
                  <div className="font-medium text-sm mb-1">{hashtag.tag}</div>
                  <Badge variant="outline" className="text-xs">
                    {hashtag.count} uses
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hashtags found in current mentions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
