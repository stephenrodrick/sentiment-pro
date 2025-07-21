import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Linkedin, Twitter, Mail } from "lucide-react"

export default function TeamPage() {
  const leadership = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former VP of AI at Google, PhD in Machine Learning from Stanford. 15+ years building AI products that scale to millions of users.",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
      twitter: "#",
      email: "sarah@sentimentwatchdog.com",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Ex-Principal Engineer at Amazon, MS Computer Science from MIT. Expert in distributed systems and real-time data processing.",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
      twitter: "#",
      email: "michael@sentimentwatchdog.com",
    },
    {
      name: "Dr. Emily Watson",
      role: "Chief AI Officer",
      bio: "Former Research Scientist at OpenAI, PhD in Natural Language Processing. Pioneer in emotion detection and sentiment analysis.",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
      twitter: "#",
      email: "emily@sentimentwatchdog.com",
    },
    {
      name: "David Kim",
      role: "VP of Engineering",
      bio: "Former Engineering Manager at Stripe, BS from UC Berkeley. Scaled engineering teams from 5 to 50+ engineers.",
      image: "/placeholder.svg?height=300&width=300",
      linkedin: "#",
      twitter: "#",
      email: "david@sentimentwatchdog.com",
    },
  ]

  const team = [
    {
      name: "Lisa Thompson",
      role: "Head of Product",
      department: "Product",
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      name: "James Wilson",
      role: "Senior ML Engineer",
      department: "Engineering",
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      name: "Maria Garcia",
      role: "VP of Sales",
      department: "Sales",
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      name: "Alex Johnson",
      role: "Head of Customer Success",
      department: "Customer Success",
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      name: "Dr. Robert Lee",
      role: "Senior Data Scientist",
      department: "AI Research",
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      name: "Jennifer Brown",
      role: "Head of Marketing",
      department: "Marketing",
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      name: "Carlos Martinez",
      role: "Senior DevOps Engineer",
      department: "Engineering",
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      name: "Dr. Priya Patel",
      role: "Research Scientist",
      department: "AI Research",
      image: "/placeholder.svg?height=250&width=250",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Meet the Team Behind{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Innovation
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're a diverse team of AI researchers, engineers, and customer experience experts passionate about
              transforming how businesses understand their customers.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Leadership Team</h2>
            <p className="text-xl text-muted-foreground">Experienced leaders driving our vision forward</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {leadership.map((leader, index) => (
              <Card key={index} className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                    <img
                      src={leader.image || "/placeholder.svg"}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{leader.name}</h3>
                      <p className="text-blue-600 font-medium">{leader.role}</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{leader.bio}</p>
                    <div className="flex items-center space-x-3">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={leader.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={leader.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`mailto:${leader.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Our Amazing Team</h2>
            <p className="text-xl text-muted-foreground">The talented individuals making it all happen</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <Badge variant="secondary" className="text-xs">
                      {member.department}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold">Join Our Mission</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for AI innovation and customer
              experience excellence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                View Open Positions
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Learn About Our Culture
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Our Culture & Values</h2>
              <p className="text-xl text-muted-foreground">What makes Sentiment Watchdog a great place to work</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">🚀 Innovation First</h3>
                  <p className="text-muted-foreground">
                    We encourage experimentation and give everyone the freedom to explore new ideas. 20% of your time
                    can be spent on passion projects.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">🌍 Remote-Friendly</h3>
                  <p className="text-muted-foreground">
                    Work from anywhere in the world. We have team members across 15+ countries and provide stipends for
                    home office setup.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">📚 Continuous Learning</h3>
                  <p className="text-muted-foreground">
                    $3,000 annual learning budget for conferences, courses, and certifications. We invest in your growth
                    and development.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">⚖️ Work-Life Balance</h3>
                  <p className="text-muted-foreground">
                    Unlimited PTO, flexible hours, and mental health support. We believe great work comes from
                    well-rested minds.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">🤝 Inclusive Environment</h3>
                  <p className="text-muted-foreground">
                    We celebrate diversity and create an environment where everyone can bring their authentic selves to
                    work.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">💰 Competitive Benefits</h3>
                  <p className="text-muted-foreground">
                    Equity for all employees, comprehensive health coverage, and retirement planning with company
                    matching.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
