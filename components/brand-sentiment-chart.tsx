"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface BrandMention {
  sentiment: {
    score: number
    emotion: string
  }
  timestamp: Date
}

interface BrandSentimentChartProps {
  mentions: BrandMention[]
}

export function BrandSentimentChart({ mentions }: BrandSentimentChartProps) {
  // Group mentions by hour for the last 24 hours
  const last24Hours = Array.from({ length: 24 }, (_, i) => {
    const date = new Date()
    date.setHours(date.getHours() - (23 - i), 0, 0, 0)
    return date
  })

  const sentimentData = last24Hours.map((hour) => {
    const hourMentions = mentions.filter((mention) => {
      const mentionHour = new Date(mention.timestamp)
      mentionHour.setMinutes(0, 0, 0)
      return mentionHour.getTime() === hour.getTime()
    })

    const averageSentiment =
      hourMentions.length > 0
        ? hourMentions.reduce((sum, mention) => sum + mention.sentiment.score, 0) / hourMentions.length
        : 0

    const positiveMentions = hourMentions.filter((m) => m.sentiment.score > 0.1).length
    const negativeMentions = hourMentions.filter((m) => m.sentiment.score < -0.1).length
    const neutralMentions = hourMentions.filter((m) => Math.abs(m.sentiment.score) <= 0.1).length

    return {
      time: hour.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      sentiment: Number(averageSentiment.toFixed(3)),
      positive: positiveMentions,
      negative: negativeMentions,
      neutral: neutralMentions,
      total: hourMentions.length,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Sentiment Trends</CardTitle>
        <CardDescription>24-hour sentiment analysis and mention volume</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Sentiment Line Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis domain={[-1, 1]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    typeof value === "number" ? value.toFixed(3) : value,
                    name === "sentiment" ? "Avg Sentiment" : name,
                  ]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="sentiment"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
                />
                {/* Reference lines */}
                <Line
                  type="monotone"
                  dataKey={() => 0.3}
                  stroke="#10B981"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={() => -0.3}
                  stroke="#EF4444"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={() => 0}
                  stroke="#6B7280"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sentiment Distribution Area Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    value,
                    name === "positive"
                      ? "Positive Mentions"
                      : name === "negative"
                        ? "Negative Mentions"
                        : "Neutral Mentions",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sentiment Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200">
              <div className="text-lg font-semibold text-green-700">
                {sentimentData.reduce((sum, data) => sum + data.positive, 0)}
              </div>
              <div className="text-sm text-green-600">Positive Mentions</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200">
              <div className="text-lg font-semibold text-yellow-700">
                {sentimentData.reduce((sum, data) => sum + data.neutral, 0)}
              </div>
              <div className="text-sm text-yellow-600">Neutral Mentions</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200">
              <div className="text-lg font-semibold text-red-700">
                {sentimentData.reduce((sum, data) => sum + data.negative, 0)}
              </div>
              <div className="text-sm text-red-600">Negative Mentions</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
