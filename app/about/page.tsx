import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Target, Users, Globe, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              About Sentiment Watchdog Pro
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Pioneering the Future of{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Customer Intelligence
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're on a mission to help businesses understand and respond to customer emotions in real-time, creating
              better experiences and stronger relationships through AI-powered insights.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <Target className="h-8 w-8 text-blue-600 mr-3" />
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To democratize customer sentiment intelligence by making advanced AI accessible to businesses of all
                  sizes. We believe every customer interaction contains valuable insights that can drive meaningful
                  improvements in products, services, and experiences.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <Globe className="h-8 w-8 text-purple-600 mr-3" />
                  Our Vision
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A world where businesses can anticipate customer needs, prevent issues before they escalate, and
                  create personalized experiences that delight customers at every touchpoint. We envision a future where
                  AI-powered empathy drives business success.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2019</div>
                  <p className="text-muted-foreground">Founded</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                  <p className="text-muted-foreground">Enterprise Clients</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">10M+</div>
                  <p className="text-muted-foreground">Messages Analyzed</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-orange-600 mb-2">99.2%</div>
                  <p className="text-muted-foreground">Accuracy Rate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Story</h2>

            <div className="space-y-12">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">2019</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">The Beginning</h3>
                  <p className="text-muted-foreground">
                    Founded by a team of AI researchers and customer experience professionals who recognized the gap
                    between customer feedback and actionable insights. Started with a simple goal: make sentiment
                    analysis accessible and actionable for every business.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">2020</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">First Enterprise Clients</h3>
                  <p className="text-muted-foreground">
                    Launched our beta platform with 10 enterprise clients. Achieved 95% accuracy in sentiment detection
                    and helped our first clients reduce customer churn by an average of 25%. Secured Series A funding to
                    scale our AI capabilities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">2021</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Global Expansion</h3>
                  <p className="text-muted-foreground">
                    Expanded to support 25+ languages and opened offices in London and Singapore. Introduced real-time
                    alerting and multi-channel integration. Reached 100+ enterprise clients across 15 countries.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">2022</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Innovation</h3>
                  <p className="text-muted-foreground">
                    Launched our proprietary emotion detection models with 99%+ accuracy. Introduced predictive
                    analytics and automated escalation features. Won "Best AI Innovation" at the Customer Experience
                    Awards.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold">2024</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sentiment Watchdog Pro</h3>
                  <p className="text-muted-foreground">
                    Launched our most advanced platform yet with enterprise-grade security, advanced analytics, and
                    seamless integrations. Now serving 500+ clients worldwide and processing over 10 million customer
                    interactions monthly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Customer-Centric</CardTitle>
                <CardDescription>
                  Every decision we make is guided by how it will improve our customers' ability to serve their
                  customers better.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Privacy First</CardTitle>
                <CardDescription>
                  We believe data privacy is a fundamental right. Our platform is built with security and privacy at its
                  core.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Continuous Innovation</CardTitle>
                <CardDescription>
                  We're constantly pushing the boundaries of what's possible with AI and sentiment analysis technology.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Global Impact</CardTitle>
                <CardDescription>
                  We're building technology that can improve customer experiences across cultures and languages
                  worldwide.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Excellence</CardTitle>
                <CardDescription>
                  We strive for excellence in everything we do, from our technology to our customer service and beyond.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>Transparency</CardTitle>
                <CardDescription>
                  We believe in open communication, clear pricing, and honest relationships with our customers and
                  partners.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
