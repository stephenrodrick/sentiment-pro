import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Calendar,
  Users,
  Award,
  Linkedin,
  Github,
  ExternalLink,
  Send,
  CheckCircle,
} from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2">
                <MessageCircle className="h-4 w-4 mr-2" />
                Get in Touch
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Contact Our{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Expert Team
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Ready to transform your customer sentiment monitoring? Our team of AI specialists and data scientists is
                here to help you get started with Sentiment Watchdog Pro.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-24">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Get detailed responses within 2 hours</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg font-semibold mb-2">support@sentimentwatchdog.com</p>
              <p className="text-sm text-muted-foreground mb-4">Available 24/7 for enterprise customers</p>
              <Button variant="outline" className="w-full bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Speak directly with our experts</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg font-semibold mb-2">+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground mb-4">Mon-Fri, 9 AM - 6 PM EST</p>
              <Button variant="outline" className="w-full bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Schedule Demo</CardTitle>
              <CardDescription>Book a personalized product demo</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg font-semibold mb-2">30-minute session</p>
              <p className="text-sm text-muted-foreground mb-4">See the platform in action</p>
              <Button variant="outline" className="w-full bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Book Demo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@company.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Your Company Name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more about your requirements..." className="min-h-32" />
                </div>

                <Button className="w-full" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Team & Office Info */}
          <div className="space-y-8">
            {/* Team Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Meet Our Team
                </CardTitle>
                <CardDescription>The experts behind Sentiment Watchdog Pro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      S
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Stephen</h3>
                      <p className="text-muted-foreground">Lead AI Engineer</p>
                      <p className="text-sm text-muted-foreground">SRM Institute of Science and Technology</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">AI/ML</Badge>
                        <Badge variant="secondary">NLP</Badge>
                        <Badge variant="secondary">Python</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Github className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      S
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Swati</h3>
                      <p className="text-muted-foreground">Full-Stack Developer</p>
                      <p className="text-sm text-muted-foreground">SRM Institute of Science and Technology</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">Node.js</Badge>
                        <Badge variant="secondary">UI/UX</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Github className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Our Location
                </CardTitle>
                <CardDescription>Visit us at our development center</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">SRM Institute of Science and Technology</p>
                      <p className="text-muted-foreground">Kattankulathur, Chennai</p>
                      <p className="text-muted-foreground">Tamil Nadu, India 603203</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Development Hours</p>
                      <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                      <p className="text-muted-foreground">Saturday: 10:00 AM - 2:00 PM IST</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Maps
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Why Choose Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">99.2%</div>
                    <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
                    <div className="text-sm text-muted-foreground">Monitoring</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">500+</div>
                    <div className="text-sm text-muted-foreground">Clients</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">10M+</div>
                    <div className="text-sm text-muted-foreground">Messages</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="border-0 shadow-lg mt-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions about our platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    How accurate is the sentiment analysis?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Our AI-powered sentiment analysis achieves 99.2% accuracy using advanced NLP models and continuous
                    learning from real-world data.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    What platforms do you monitor?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    We monitor Twitter, Instagram, Facebook, LinkedIn, TikTok, YouTube, Reddit, and major news outlets
                    in real-time.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    How quickly are alerts sent?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Critical alerts are sent within seconds via SMS, email, and Slack. Our average response time is
                    under 30 seconds.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Is there a free trial available?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Yes! We offer a 14-day free trial with full access to all features. No credit card required to get
                    started.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Can I customize the dashboard?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Our dashboard is fully customizable with drag-and-drop widgets, custom metrics, and personalized
                    alert rules.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Do you offer API access?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Yes, we provide comprehensive REST APIs and webhooks for seamless integration with your existing
                    tools and workflows.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join hundreds of companies using Sentiment Watchdog Pro to monitor their brand reputation and improve
                customer satisfaction.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link href="/platform">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Try Live Demo
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
