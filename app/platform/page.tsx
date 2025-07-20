"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertTriangle,
  MessageCircle,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  Activity,
  Play,
  Pause,
  Hash,
  Eye,
  Heart,
  Share,
  MessageSquare,
  Star,
  Target,
  Plus,
  Flame,
} from "lucide-react"
import { InfluencerTracker } from "@/components/influencer-tracker"
import { CompetitorAnalysis } from "@/components/competitor-analysis"
import { SocialMediaMetrics } from "@/components/social-media-metrics"
import { TrendingTopics } from "@/components/trending-topics"
import { BrandSentimentChart } from "@/components/brand-sentiment-chart"
import { AlertsPanel } from "@/components/alerts-panel"

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
  keywords: string[]
  hashtags: string[]
  mentions: string[]
  timestamp: Date
  location?: string
  language: string
  brandRelevance: number
  viralPotential: number
  isCompetitor: boolean
  competitorBrand?: string
  priority: "low" | "medium" | "high" | "critical"
  category: "product" | "service" | "brand" | "campaign" | "crisis" | "opportunity"
}

interface BrandAlert {
  id: string
  type: "viral_mention" | "negative_sentiment" | "competitor_activity" | "influencer_mention" | "crisis_detection"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  mentions: BrandMention[]
  timestamp: Date
  acknowledged: boolean
  assignedTo?: string
  actionTaken?: string
}

interface MonitoringStats {
  totalMentions: number
  positiveMentions: number
  negativeMentions: number
  neutralMentions: number
  averageSentiment: number
  totalReach: number
  totalEngagement: number
  influencerMentions: number
  competitorMentions: number
  viralPosts: number
  alertsTriggered: number
  shareOfVoice: number
  brandHealth: number
  trendingScore: number
}

export default function BrandMonitoringPlatform() {
  const [mentions, setMentions] = useState<BrandMention[]>([])
  const [alerts, setAlerts] = useState<BrandAlert[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [selectedSentiment, setSelectedSentiment] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [monitoredKeywords, setMonitoredKeywords] = useState<string[]>([
    "YourBrand",
    "@yourbrand",
    "#yourbrand",
    "your product name",
  ])
  const [competitorKeywords, setCompetitorKeywords] = useState<string[]>([
    "Competitor1",
    "Competitor2",
    "Alternative Brand",
  ])

  const [stats, setStats] = useState<MonitoringStats>({
    totalMentions: 0,
    positiveMentions: 0,
    negativeMentions: 0,
    neutralMentions: 0,
    averageSentiment: 0,
    totalReach: 0,
    totalEngagement: 0,
    influencerMentions: 0,
    competitorMentions: 0,
    viralPosts: 0,
    alertsTriggered: 0,
    shareOfVoice: 0,
    brandHealth: 0,
    trendingScore: 0,
  })

  // Enhanced brand mention generation with realistic social media scenarios
  const generateBrandMention = (): BrandMention => {
    const platforms: BrandMention["platform"][] = [
      "twitter",
      "instagram",
      "facebook",
      "linkedin",
      "tiktok",
      "youtube",
      "reddit",
      "news",
    ]

    const authors = [
      {
        username: "techinfluencer",
        displayName: "Tech Guru Sarah",
        followers: 125000,
        verified: true,
        tier: "macro" as const,
        niche: "technology",
      },
      {
        username: "lifestyle_blogger",
        displayName: "Emma Lifestyle",
        followers: 45000,
        verified: false,
        tier: "micro" as const,
        niche: "lifestyle",
      },
      {
        username: "business_expert",
        displayName: "Michael Business",
        followers: 89000,
        verified: true,
        tier: "macro" as const,
        niche: "business",
      },
      {
        username: "everyday_user",
        displayName: "John Smith",
        followers: 1200,
        verified: false,
        tier: "nano" as const,
        niche: "general",
      },
      {
        username: "mega_influencer",
        displayName: "Celebrity Star",
        followers: 2500000,
        verified: true,
        tier: "mega" as const,
        niche: "entertainment",
      },
    ]

    const brandMentionTemplates = [
      {
        text: "Just tried @YourBrand's new product and I'm absolutely blown away! The quality is incredible and the customer service was outstanding. Definitely recommending this to all my followers! #YourBrand #ProductReview #Sponsored",
        sentiment: { score: 0.8, emotion: "positive" as const },
        category: "product" as const,
        priority: "medium" as const,
        hashtags: ["#YourBrand", "#ProductReview", "#Sponsored"],
        viralPotential: 0.7,
      },
      {
        text: "Disappointed with @YourBrand's latest update. The new interface is confusing and I've lost some important features. Hope they fix this soon because I've been a loyal customer for years. #YourBrand #Feedback",
        sentiment: { score: -0.6, emotion: "negative" as const },
        category: "product" as const,
        priority: "high" as const,
        hashtags: ["#YourBrand", "#Feedback"],
        viralPotential: 0.4,
      },
      {
        text: "Comparing @YourBrand vs @Competitor1 - both have their strengths but I'm leaning towards YourBrand for their customer support and innovation. What do you think? #BrandComparison #TechReview",
        sentiment: { score: 0.3, emotion: "positive" as const },
        category: "brand" as const,
        priority: "medium" as const,
        hashtags: ["#BrandComparison", "#TechReview"],
        viralPotential: 0.6,
      },
      {
        text: "BREAKING: @YourBrand just announced their partnership with major tech company! This could be a game-changer for the industry. Excited to see what they build together! 🚀 #YourBrand #Partnership #TechNews",
        sentiment: { score: 0.9, emotion: "positive" as const },
        category: "brand" as const,
        priority: "high" as const,
        hashtags: ["#YourBrand", "#Partnership", "#TechNews"],
        viralPotential: 0.9,
      },
      {
        text: "Anyone else having issues with @YourBrand's service today? Been trying to access my account for hours with no luck. Their support team hasn't responded yet. #YourBrand #ServiceDown #Help",
        sentiment: { score: -0.7, emotion: "negative" as const },
        category: "crisis" as const,
        priority: "critical" as const,
        hashtags: ["#YourBrand", "#ServiceDown", "#Help"],
        viralPotential: 0.8,
      },
      {
        text: "Love how @YourBrand is always innovating! Their latest campaign is so creative and really speaks to their values. Proud to be a customer and supporter! ❤️ #YourBrand #Innovation #BrandLove",
        sentiment: { score: 0.7, emotion: "positive" as const },
        category: "campaign" as const,
        priority: "medium" as const,
        hashtags: ["#YourBrand", "#Innovation", "#BrandLove"],
        viralPotential: 0.5,
      },
      {
        text: "Thinking about switching from @Competitor1 to @YourBrand. I've heard great things about their new features and pricing seems more competitive. Anyone made this switch recently? #YourBrand #Switching",
        sentiment: { score: 0.4, emotion: "positive" as const },
        category: "opportunity" as const,
        priority: "medium" as const,
        hashtags: ["#YourBrand", "#Switching"],
        viralPotential: 0.3,
      },
      {
        text: "Just saw @YourBrand's CEO speak at the conference. Really impressed with their vision for the future and commitment to sustainability. This is why I choose brands that align with my values! #YourBrand #Sustainability #Leadership",
        sentiment: { score: 0.6, emotion: "positive" as const },
        category: "brand" as const,
        priority: "low" as const,
        hashtags: ["#YourBrand", "#Sustainability", "#Leadership"],
        viralPotential: 0.4,
      },
    ]

    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const author = authors[Math.floor(Math.random() * authors.length)]
    const template = brandMentionTemplates[Math.floor(Math.random() * brandMentionTemplates.length)]

    // Adjust metrics based on platform and author tier
    const baseMetrics = {
      nano: { likes: 50, shares: 5, comments: 10, views: 500 },
      micro: { likes: 500, shares: 50, comments: 100, views: 5000 },
      macro: { likes: 2000, shares: 200, comments: 400, views: 20000 },
      mega: { likes: 10000, shares: 1000, comments: 2000, views: 100000 },
      celebrity: { likes: 50000, shares: 5000, comments: 10000, views: 500000 },
    }

    const metrics = baseMetrics[author.tier]
    const randomMultiplier = 0.5 + Math.random() * 1.5

    return {
      id: Math.random().toString(36).substr(2, 9),
      platform,
      author: {
        username: author.username,
        displayName: author.displayName,
        followers: author.followers,
        verified: author.verified,
        profileImage: `/placeholder.svg?height=40&width=40&text=${author.displayName.charAt(0)}`,
        influencerTier: author.tier,
      },
      content: {
        text: template.text,
        url: `https://${platform}.com/${author.username}/post/${Math.random().toString(36).substr(2, 9)}`,
        images: Math.random() > 0.7 ? [`/placeholder.svg?height=300&width=400&text=Post Image`] : undefined,
      },
      metrics: {
        likes: Math.floor(metrics.likes * randomMultiplier),
        shares: Math.floor(metrics.shares * randomMultiplier),
        comments: Math.floor(metrics.comments * randomMultiplier),
        views: Math.floor(metrics.views * randomMultiplier),
        engagement: Math.random() * 10 + 2,
        reach: Math.floor(metrics.views * randomMultiplier * 1.5),
      },
      sentiment: {
        score: template.sentiment.score + (Math.random() - 0.5) * 0.2,
        emotion: template.sentiment.emotion,
        confidence: 0.8 + Math.random() * 0.2,
      },
      keywords: monitoredKeywords.filter(() => Math.random() > 0.5),
      hashtags: template.hashtags,
      mentions: ["@YourBrand"],
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      location: ["Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad"][Math.floor(Math.random() * 5)],
      language: "en",
      brandRelevance: 0.7 + Math.random() * 0.3,
      viralPotential: template.viralPotential,
      isCompetitor: Math.random() > 0.8,
      competitorBrand: Math.random() > 0.8 ? "Competitor1" : undefined,
      priority: template.priority,
      category: template.category,
    }
  }

  // Enhanced monitoring with real-time social media processing
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(
      async () => {
        const newMention = generateBrandMention()
        const processedMention = await processBrandMention(newMention)

        setMentions((prev) => {
          const updated = [processedMention, ...prev].slice(0, 1000)
          checkForBrandAlerts(updated)
          updateBrandStats(updated)
          return updated
        })
      },
      Math.random() * 3000 + 1000, // 1-4 seconds between mentions
    )

    return () => clearInterval(interval)
  }, [isMonitoring, monitoredKeywords])

  const processBrandMention = async (mention: BrandMention): Promise<BrandMention> => {
    try {
      const response = await fetch("/api/analyze-brand-mention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mention,
          brandKeywords: monitoredKeywords,
          competitorKeywords,
        }),
      })

      if (response.ok) {
        const analysis = await response.json()

        // Enhanced JSON output for brand monitoring
        const brandOutput = {
          mentionId: mention.id,
          timestamp: mention.timestamp.toISOString(),
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
            hasMedia: !!(mention.content.images || mention.content.videos),
          },
          metrics: mention.metrics,
          sentiment: {
            score: analysis.sentimentScore || mention.sentiment.score,
            emotion: analysis.emotion || mention.sentiment.emotion,
            confidence: analysis.confidence || mention.sentiment.confidence,
            reasoning: analysis.reasoning,
          },
          brandAnalysis: {
            relevance: mention.brandRelevance,
            viralPotential: mention.viralPotential,
            priority: mention.priority,
            category: mention.category,
            isCompetitor: mention.isCompetitor,
            competitorBrand: mention.competitorBrand,
          },
          keywords: mention.keywords,
          hashtags: mention.hashtags,
          mentions: mention.mentions,
          location: mention.location,
          language: mention.language,
          processing: {
            timestamp: new Date().toISOString(),
            model: "enhanced-fallback-analysis",
            processed: true,
          },
        }

        console.log("🔍 BRAND MENTION ANALYZED:", JSON.stringify(brandOutput, null, 2))

        return {
          ...mention,
          sentiment: {
            score: analysis.sentimentScore || mention.sentiment.score,
            emotion: analysis.emotion || mention.sentiment.emotion,
            confidence: analysis.confidence || mention.sentiment.confidence,
          },
        }
      } else {
        console.warn("API response not OK, using original mention data")
        return mention
      }
    } catch (error) {
      console.error("Brand mention analysis failed, using original data:", error)
      return mention
    }
  }

  const checkForBrandAlerts = (mentions: BrandMention[]) => {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    // Check for viral mentions
    const viralMentions = mentions.filter(
      (mention) => mention.timestamp > oneHourAgo && mention.viralPotential > 0.8 && mention.metrics.engagement > 5,
    )

    if (viralMentions.length > 0) {
      viralMentions.forEach((mention) => {
        const existingAlert = alerts.find((alert) => alert.mentions.some((m) => m.id === mention.id))
        if (!existingAlert) {
          const viralAlert: BrandAlert = {
            id: `viral-${mention.id}`,
            type: "viral_mention",
            severity: mention.viralPotential > 0.9 ? "critical" : "high",
            title: `Viral Mention Detected: ${mention.author.displayName}`,
            description: `High viral potential mention from ${mention.author.influencerTier} influencer with ${mention.author.followers.toLocaleString()} followers`,
            mentions: [mention],
            timestamp: new Date(),
            acknowledged: false,
          }
          setAlerts((prev) => [viralAlert, ...prev].slice(0, 100))
          triggerBrandAlert(viralAlert)
        }
      })
    }

    // Check for negative sentiment spikes
    const recentNegativeMentions = mentions.filter(
      (mention) => mention.timestamp > oneHourAgo && mention.sentiment.score < -0.5,
    )

    if (recentNegativeMentions.length >= 3) {
      const existingAlert = alerts.find(
        (alert) => alert.type === "negative_sentiment" && alert.timestamp > oneHourAgo && !alert.acknowledged,
      )

      if (!existingAlert) {
        const negativeAlert: BrandAlert = {
          id: `negative-${Date.now()}`,
          type: "negative_sentiment",
          severity: recentNegativeMentions.length >= 5 ? "critical" : "high",
          title: "Negative Sentiment Spike Detected",
          description: `${recentNegativeMentions.length} negative mentions in the last hour`,
          mentions: recentNegativeMentions,
          timestamp: new Date(),
          acknowledged: false,
        }
        setAlerts((prev) => [negativeAlert, ...prev].slice(0, 100))
        triggerBrandAlert(negativeAlert)
      }
    }

    // Check for crisis indicators
    const crisisMentions = mentions.filter(
      (mention) =>
        mention.timestamp > oneHourAgo &&
        mention.category === "crisis" &&
        (mention.content.text.toLowerCase().includes("down") ||
          mention.content.text.toLowerCase().includes("broken") ||
          mention.content.text.toLowerCase().includes("issue")),
    )

    if (crisisMentions.length >= 2) {
      const existingAlert = alerts.find(
        (alert) => alert.type === "crisis_detection" && alert.timestamp > oneHourAgo && !alert.acknowledged,
      )

      if (!existingAlert) {
        const crisisAlert: BrandAlert = {
          id: `crisis-${Date.now()}`,
          type: "crisis_detection",
          severity: "critical",
          title: "Potential Crisis Detected",
          description: `Multiple mentions indicating service issues or problems`,
          mentions: crisisMentions,
          timestamp: new Date(),
          acknowledged: false,
        }
        setAlerts((prev) => [crisisAlert, ...prev].slice(0, 100))
        triggerBrandAlert(crisisAlert)
      }
    }

    // Check for influencer mentions
    const influencerMentions = mentions.filter(
      (mention) =>
        mention.timestamp > oneHourAgo &&
        (mention.author.influencerTier === "macro" ||
          mention.author.influencerTier === "mega" ||
          mention.author.influencerTier === "celebrity") &&
        mention.author.followers > 100000,
    )

    if (influencerMentions.length > 0) {
      influencerMentions.forEach((mention) => {
        const existingAlert = alerts.find((alert) => alert.mentions.some((m) => m.id === mention.id))
        if (!existingAlert) {
          const influencerAlert: BrandAlert = {
            id: `influencer-${mention.id}`,
            type: "influencer_mention",
            severity: mention.author.followers > 1000000 ? "high" : "medium",
            title: `Influencer Mention: ${mention.author.displayName}`,
            description: `${mention.author.influencerTier} influencer with ${mention.author.followers.toLocaleString()} followers mentioned your brand`,
            mentions: [mention],
            timestamp: new Date(),
            acknowledged: false,
          }
          setAlerts((prev) => [influencerAlert, ...prev].slice(0, 100))
          triggerBrandAlert(influencerAlert)
        }
      })
    }
  }

  const triggerBrandAlert = async (alert: BrandAlert) => {
    const alertOutput = {
      alertId: alert.id,
      timestamp: alert.timestamp.toISOString(),
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      brandContext: {
        monitoredKeywords,
        competitorKeywords,
        totalMentions: mentions.length,
        averageSentiment: stats.averageSentiment,
      },
      affectedMentions: alert.mentions.map((mention) => ({
        id: mention.id,
        platform: mention.platform,
        author: mention.author.displayName,
        followers: mention.author.followers,
        influencerTier: mention.author.influencerTier,
        sentiment: mention.sentiment,
        metrics: mention.metrics,
        viralPotential: mention.viralPotential,
        url: mention.content.url,
      })),
      notifications: {
        slack: true,
        email: true,
        sms: true,
        webhook: true,
        dashboard: true,
      },
    }

    console.log("🚨 BRAND ALERT TRIGGERED:", JSON.stringify(alertOutput, null, 2))

    try {
      await fetch("/api/send-brand-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertOutput),
      })
    } catch (error) {
      console.error("Failed to send brand alert:", error)
    }
  }

  const updateBrandStats = (mentions: BrandMention[]) => {
    const positiveMentions = mentions.filter((m) => m.sentiment.score > 0.1)
    const negativeMentions = mentions.filter((m) => m.sentiment.score < -0.1)
    const neutralMentions = mentions.filter((m) => Math.abs(m.sentiment.score) <= 0.1)

    const averageSentiment =
      mentions.length > 0 ? mentions.reduce((sum, m) => sum + m.sentiment.score, 0) / mentions.length : 0

    const totalReach = mentions.reduce((sum, m) => sum + m.metrics.reach, 0)
    const totalEngagement = mentions.reduce((sum, m) => sum + m.metrics.engagement, 0)

    const influencerMentions = mentions.filter(
      (m) =>
        m.author.influencerTier === "macro" ||
        m.author.influencerTier === "mega" ||
        m.author.influencerTier === "celebrity",
    )

    const competitorMentions = mentions.filter((m) => m.isCompetitor)
    const viralPosts = mentions.filter((m) => m.viralPotential > 0.7)

    const brandHealth = Math.max(0, Math.min(100, 50 + averageSentiment * 50))
    const shareOfVoice = Math.random() * 20 + 15 // Simulated share of voice percentage

    setStats({
      totalMentions: mentions.length,
      positiveMentions: positiveMentions.length,
      negativeMentions: negativeMentions.length,
      neutralMentions: neutralMentions.length,
      averageSentiment,
      totalReach,
      totalEngagement,
      influencerMentions: influencerMentions.length,
      competitorMentions: competitorMentions.length,
      viralPosts: viralPosts.length,
      alertsTriggered: alerts.length,
      shareOfVoice,
      brandHealth,
      trendingScore: Math.random() * 100,
    })
  }

  const exportBrandData = async (format: "csv" | "json" | "pdf") => {
    const exportData = {
      timestamp: new Date().toISOString(),
      format,
      brandMonitoring: {
        keywords: monitoredKeywords,
        competitors: competitorKeywords,
        timeRange: selectedTimeRange,
        totalMentions: stats.totalMentions,
        brandHealth: stats.brandHealth,
        shareOfVoice: stats.shareOfVoice,
      },
      mentions: mentions.slice(0, 1000).map((mention) => ({
        id: mention.id,
        timestamp: mention.timestamp.toISOString(),
        platform: mention.platform,
        author: {
          username: mention.author.username,
          displayName: mention.author.displayName,
          followers: mention.author.followers,
          verified: mention.author.verified,
          influencerTier: mention.author.influencerTier,
        },
        content: mention.content.text,
        metrics: mention.metrics,
        sentiment: mention.sentiment,
        brandRelevance: mention.brandRelevance,
        viralPotential: mention.viralPotential,
        category: mention.category,
        priority: mention.priority,
        hashtags: mention.hashtags,
        keywords: mention.keywords,
      })),
      alerts: alerts.map((alert) => ({
        id: alert.id,
        timestamp: alert.timestamp.toISOString(),
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        acknowledged: alert.acknowledged,
      })),
      analytics: stats,
    }

    console.log("📊 BRAND DATA EXPORT:", JSON.stringify(exportData, null, 2))

    try {
      const response = await fetch("/api/export-brand-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `brand-monitoring-${new Date().toISOString().split("T")[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const filteredMentions = mentions.filter((mention) => {
    const matchesPlatform = selectedPlatform === "all" || mention.platform === selectedPlatform
    const matchesSentiment =
      selectedSentiment === "all" ||
      (selectedSentiment === "positive" && mention.sentiment.score > 0.1) ||
      (selectedSentiment === "negative" && mention.sentiment.score < -0.1) ||
      (selectedSentiment === "neutral" && Math.abs(mention.sentiment.score) <= 0.1)
    const matchesSearch =
      searchQuery === "" ||
      mention.content.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mention.author.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mention.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesPlatform && matchesSentiment && matchesSearch
  })

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

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return "text-green-600"
    if (score < -0.3) return "text-red-600"
    return "text-yellow-600"
  }

  const getInfluencerTierBadge = (tier: string) => {
    const colors = {
      nano: "bg-gray-100 text-gray-800",
      micro: "bg-blue-100 text-blue-800",
      macro: "bg-purple-100 text-purple-800",
      mega: "bg-orange-100 text-orange-800",
      celebrity: "bg-red-100 text-red-800",
    }
    return colors[tier as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Professional Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Brand Monitoring Hub
                  </h1>
                  <p className="text-sm text-muted-foreground">Real-time Social Media & Competitor Intelligence</p>
                </div>
              </div>
              <Badge variant={isMonitoring ? "default" : "secondary"} className="ml-4">
                {isMonitoring ? (
                  <>
                    <Activity className="h-3 w-3 mr-1 animate-pulse" />
                    LIVE MONITORING
                  </>
                ) : (
                  "PAUSED"
                )}
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="6h">Last 6 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => exportBrandData("json")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                variant={isMonitoring ? "destructive" : "default"}
                className="min-w-36"
              >
                {isMonitoring ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Monitoring
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Monitoring
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Brand Health Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
              <MessageCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{stats.totalMentions.toLocaleString()}</div>
              <p className="text-xs text-purple-600 mt-1">Across all platforms</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brand Health</CardTitle>
              <Heart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.brandHealth.toFixed(0)}%</div>
              <p className="text-xs text-green-600 mt-1">Overall sentiment score</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{(stats.totalReach / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-blue-600 mt-1">Potential impressions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Influencer Mentions</CardTitle>
              <Star className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{stats.influencerMentions}</div>
              <p className="text-xs text-orange-600 mt-1">From verified influencers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Share of Voice</CardTitle>
              <BarChart3 className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{stats.shareOfVoice.toFixed(1)}%</div>
              <p className="text-xs text-red-600 mt-1">vs competitors</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">{alerts.filter((a) => !a.acknowledged).length}</div>
              <p className="text-xs text-yellow-600 mt-1">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        {alerts.filter((a) => !a.acknowledged).length > 0 && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Active Brand Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts
                  .filter((a) => !a.acknowledged)
                  .slice(0, 3)
                  .map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={
                            alert.severity === "critical"
                              ? "destructive"
                              : alert.severity === "high"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, acknowledged: true } : a)))
                        }}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Keyword Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Monitoring Keywords
            </CardTitle>
            <CardDescription>Manage brand and competitor keywords for real-time tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Brand Keywords</Label>
                <div className="flex flex-wrap gap-2">
                  {monitoredKeywords.map((keyword, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {keyword}
                      <button
                        onClick={() => {
                          setMonitoredKeywords((prev) => prev.filter((_, i) => i !== index))
                        }}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add brand keyword..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const value = e.currentTarget.value.trim()
                        if (value && !monitoredKeywords.includes(value)) {
                          setMonitoredKeywords((prev) => [...prev, value])
                          e.currentTarget.value = ""
                        }
                      }
                    }}
                  />
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Competitor Keywords</Label>
                <div className="flex flex-wrap gap-2">
                  {competitorKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <button
                        onClick={() => {
                          setCompetitorKeywords((prev) => prev.filter((_, i) => i !== index))
                        }}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add competitor keyword..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const value = e.currentTarget.value.trim()
                        if (value && !competitorKeywords.includes(value)) {
                          setCompetitorKeywords((prev) => [...prev, value])
                          e.currentTarget.value = ""
                        }
                      }
                    }}
                  />
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Content</Label>
                <Input
                  id="search"
                  placeholder="Search mentions, hashtags, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="twitter">𝕏 Twitter</SelectItem>
                    <SelectItem value="instagram">📷 Instagram</SelectItem>
                    <SelectItem value="facebook">📘 Facebook</SelectItem>
                    <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                    <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                    <SelectItem value="youtube">📺 YouTube</SelectItem>
                    <SelectItem value="reddit">🤖 Reddit</SelectItem>
                    <SelectItem value="news">📰 News</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sentiment">Sentiment</Label>
                <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="positive">😊 Positive</SelectItem>
                    <SelectItem value="negative">😞 Negative</SelectItem>
                    <SelectItem value="neutral">😐 Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportBrandData("csv")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="live-feed" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="live-feed">Live Feed</TabsTrigger>
            <TabsTrigger value="influencers">Influencers</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="live-feed">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Live Brand Mentions Feed
                    </span>
                    <Badge variant="outline">{filteredMentions.length} mentions</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {filteredMentions.slice(0, 20).map((mention) => (
                      <div key={mention.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                              {mention.author.displayName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{mention.author.displayName}</p>
                                {mention.author.verified && <Badge variant="secondary">✓</Badge>}
                                <Badge className={getInfluencerTierBadge(mention.author.influencerTier)}>
                                  {mention.author.influencerTier}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                @{mention.author.username} • {mention.author.followers.toLocaleString()} followers
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getPlatformIcon(mention.platform)}</span>
                            <Badge
                              variant={mention.priority === "critical" ? "destructive" : "outline"}
                              className="text-xs"
                            >
                              {mention.priority}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm mb-3 leading-relaxed">{mention.content.text}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {mention.metrics.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share className="h-4 w-4" />
                              {mention.metrics.shares.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {mention.metrics.comments.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {mention.metrics.views.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={`${getSentimentColor(mention.sentiment.score)} border-current`}
                            >
                              {mention.sentiment.emotion} ({mention.sentiment.score.toFixed(2)})
                            </Badge>
                            {mention.viralPotential > 0.7 && (
                              <Badge variant="destructive" className="animate-pulse">
                                <Flame className="h-3 w-3 mr-1" />
                                Viral
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {mention.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        {mention.hashtags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {mention.hashtags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="influencers">
            <InfluencerTracker mentions={filteredMentions} />
          </TabsContent>

          <TabsContent value="competitors">
            <CompetitorAnalysis mentions={filteredMentions} competitors={competitorKeywords} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BrandSentimentChart mentions={filteredMentions} />
              <SocialMediaMetrics mentions={filteredMentions} />
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel
              alerts={alerts}
              onAcknowledge={(id) => {
                setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
              }}
            />
          </TabsContent>

          <TabsContent value="trending">
            <TrendingTopics mentions={filteredMentions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
