import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Bot,
  Users,
  Shield,
  TrendingUp,
  ChevronRight,
  Check,
  Star,
  ArrowRight,
  Play,
  Brain,
  HeartPulse,
  UserSearch,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const agents = [
  { icon: <UserSearch className="w-4 h-4" />, name: "Talent Scout", desc: "Screens, ranks, and schedules candidates" },
  { icon: <HeartPulse className="w-4 h-4" />, name: "Culture Sentinel", desc: "Monitors engagement and sentiment" },
  { icon: <TrendingUp className="w-4 h-4" />, name: "Retention Analyst", desc: "Predicts attrition and plans interventions" },
  { icon: <Rocket className="w-4 h-4" />, name: "Onboarding Agent", desc: "Automates onboarding workflows" },
  { icon: <ShieldCheck className="w-4 h-4" />, name: "Performance Coach", desc: "Drives goals and feedback loops" },
  { icon: <Brain className="w-4 h-4" />, name: "CHRO Copilot", desc: "Strategic intelligence for executives" },
];

const features = [
  { icon: <Bot className="w-5 h-5" />, title: "AI-Powered Hiring", description: "Automated resume screening, candidate ranking, and bias-free assessments." },
  { icon: <Users className="w-5 h-5" />, title: "People Intelligence", description: "Culture metrics, retention analysis, and performance insights in one place." },
  { icon: <Shield className="w-5 h-5" />, title: "Compliance Automation", description: "GDPR, DPDP, and labor law compliance with AI-driven policy management." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Predictive Analytics", description: "Attrition prediction, engagement trends, and workforce planning insights." },
  { icon: <Rocket className="w-5 h-5" />, title: "Smart Onboarding", description: "Automated workflows, task timelines, and personalized welcome experiences." },
  { icon: <Brain className="w-5 h-5" />, title: "Executive Intelligence", description: "Board-ready reports, scenario analysis, and strategic workforce forecasts." },
];

const stats = [
  { value: "89%", label: "Reduction in HR admin time" },
  { value: "3.2x", label: "Faster hiring decisions" },
  { value: "67%", label: "Lower cost per hire" },
  { value: "99.9%", label: "Compliance accuracy" },
];

const testimonials = [
  { quote: "NexusHR replaced our 12-person HR team with AI agents. We're now running leaner with better outcomes.", author: "Sarah Chen", role: "CHRO, TechScale Inc", rating: 5 },
  { quote: "The hiring AI reduced our time-to-fill from 45 days to 12. It's like having a tireless recruitment team.", author: "Marcus Thompson", role: "VP People, GrowthCo", rating: 5 },
  { quote: "Compliance used to give me nightmares. Now the AI handles everything—audits, policies, consent management.", author: "Priya Sharma", role: "HR Director, FinServe Global", rating: 5 },
];

const pricingPlans = [
  { name: "Starter", price: "$8", period: "per employee/month", description: "For growing teams up to 50 employees", features: ["Core HR Management", "Talent Scout Agent", "Basic Analytics", "Employee Self-Service", "Standard Reports", "Email Support"] },
  { name: "Professional", price: "$15", period: "per employee/month", description: "For scaling companies up to 500 employees", popular: true, features: ["Everything in Starter", "All 6 AI Agents", "Performance Management", "Advanced Analytics", "Executive Reports", "Custom Integrations", "Priority Support"] },
  { name: "Enterprise", price: "Custom", period: "contact sales", description: "For large organizations with complex needs", features: ["Everything in Professional", "Dedicated AI Training", "Multi-Entity Support", "Custom Compliance Modules", "SLA Guarantees", "Dedicated Success Manager", "On-Premise Option"] },
];

const logos = ["TechScale", "GrowthCo", "FinServe", "Innovate Labs", "CloudFirst", "DataDrive"];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container-wide section-padding">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">NexusHR</span>
              <span className="text-xs font-medium text-primary">AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#agents" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Agents</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/candidate/dashboard">Candidate Portal</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/dashboard">
                  HR Portal
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="container-wide section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Native HR Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight text-balance">
              Unburden Your HR Team{" "}
              <span className="text-primary">with AI</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              6 specialized AI agents replace manual HR processes. Hiring, culture, retention, onboarding, performance, and executive intelligence — all automated.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/dashboard">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="py-12 border-y border-border bg-card/50">
        <div className="container-wide section-padding">
          <p className="text-center text-sm text-muted-foreground mb-8">Trusted by forward-thinking enterprises</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((logo) => (
              <div key={logo} className="text-lg font-semibold text-secondary">{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container-wide section-padding">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">Every HR Function, Powered by AI</h2>
            <p className="mt-4 text-muted-foreground">A complete platform that replaces traditional HR operations with intelligent automation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-interactive p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">{feature.icon}</div>
                <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents */}
      <section id="agents" className="py-20 lg:py-28 bg-card/50">
        <div className="container-wide section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Bot className="w-4 h-4" />
                6 Specialized AI Agents
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">AI Agents Replace Human HR Tasks</h2>
              <p className="mt-4 text-muted-foreground">Each agent is trained on a specific HR domain, working 24/7 with consistent accuracy and zero bias.</p>
              <div className="mt-8 space-y-3">
                {agents.map((agent) => (
                  <div key={agent.name} className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{agent.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-elevated p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <UserSearch className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Talent Scout</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs text-muted-foreground">Active</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Latest Action</p>
                  <p className="text-foreground">Screened 47 applications for Senior Engineer role</p>
                </div>
                <div className="p-3 rounded-lg bg-background border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
                  <p className="text-foreground">3 candidates ready for technical interview</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
                    <p className="text-lg font-semibold text-primary">94%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-lg font-semibold text-foreground">2.3s</p>
                    <p className="text-xs text-muted-foreground">Avg Response</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-center">
                    <p className="text-lg font-semibold text-foreground">847</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-28">
        <div className="container-wide section-padding">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">Trusted by HR Leaders</h2>
            <p className="mt-4 text-muted-foreground">See how enterprises are transforming their HR operations with AI.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="card-elevated p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground">{t.author.split(" ").map((n) => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28 bg-card/50">
        <div className="container-wide section-padding">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">Transparent Pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free, scale as you grow. No hidden fees, no long-term contracts.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`card-elevated p-6 relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">Most Popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container-wide section-padding">
          <div className="card-elevated p-8 lg:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Ready to Transform Your HR?</h2>
            <p className="mt-4 text-muted-foreground">Join hundreds of companies automating HR with AI. Start your free trial today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">Schedule Demo</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container-wide section-padding">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">NexusHR</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Security</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 NexusHR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
