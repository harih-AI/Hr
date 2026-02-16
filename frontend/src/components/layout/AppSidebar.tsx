import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  UserSearch,
  HeartPulse,
  ShieldCheck,
  Rocket,
  TrendingUp,
  Brain,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Lock,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  children?: { title: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    title: "Command Center",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    title: "AI Agents",
    href: "/agents",
    icon: <Bot className="w-4 h-4" />,
  },
  {
    title: "Hiring Console",
    href: "/hiring",
    icon: <UserSearch className="w-4 h-4" />,
  },
  {
    title: "Candidate Approval",
    href: "/approval",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    title: "Job Postings",
    href: "/jobs",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    title: "People Intelligence",
    href: "/people",
    icon: <Users className="w-4 h-4" />,
  },
  {
    title: "Executive Command",
    href: "/executive",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    title: "Admin Panel",
    href: "/admin",
    icon: <Lock className="w-4 h-4" />,
  },
];

const agentNav: { title: string; href: string; icon: React.ReactNode }[] = [
  { title: "Talent Scout", href: "/agents?agent=talent-scout", icon: <UserSearch className="w-3.5 h-3.5" /> },
  { title: "Culture Sentinel", href: "/agents?agent=culture-sentinel", icon: <HeartPulse className="w-3.5 h-3.5" /> },
  { title: "Retention Analyst", href: "/agents?agent=retention-analyst", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { title: "Onboarding Agent", href: "/agents?agent=onboarding-agent", icon: <Rocket className="w-3.5 h-3.5" /> },
  { title: "Performance Coach", href: "/agents?agent=performance-coach", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { title: "CHRO Copilot", href: "/agents?agent=chro-copilot", icon: <Brain className="w-3.5 h-3.5" /> },
];

export function AppSidebar() {
  const location = useLocation();
  const [agentsExpanded, setAgentsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">NexusHR</span>
            <span className="text-xs text-primary ml-1.5">AI</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigation.map((item) => {
          const isAgents = item.title === "AI Agents";
          return (
            <div key={item.title}>
              {isAgents ? (
                <>
                  <button
                    onClick={() => setAgentsExpanded(!agentsExpanded)}
                    className={cn(
                      "nav-item w-full justify-between",
                      isActive("/agents") && "nav-item-active"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        agentsExpanded && "rotate-180"
                      )}
                    />
                  </button>
                  {agentsExpanded && (
                    <div className="ml-7 mt-1 space-y-1">
                      <Link
                        to="/agents"
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md transition-colors",
                          location.pathname === "/agents" && !location.search
                            ? "bg-accent text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        All Agents
                      </Link>
                      {agentNav.map((agent) => (
                        <Link
                          key={agent.title}
                          to={agent.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                            "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          {agent.icon}
                          {agent.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "nav-item",
                    isActive(item.href) && "nav-item-active"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/settings"
          className="nav-item"
          onClick={() => setMobileOpen(false)}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>
    </>
  );
}
