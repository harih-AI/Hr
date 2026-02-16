import { DashboardLayout } from "@/components/layout";
import { StatusBadge, Timeline } from "@/components/hr";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentStore } from "@/store/agentStore";
import { agentsService } from "@/services/agents";
import { useQuery } from "@tanstack/react-query";
import type { Agent } from "@/types/api";
import {
  Bot,
  Brain,
  HeartPulse,
  ShieldCheck,
  Rocket,
  TrendingUp,
  UserSearch,
  Settings,
  Activity,
  BarChart3,
  RefreshCw,
  Play,
  Pause,
} from "lucide-react";
import { type ReactNode } from "react";

const agentIcons: Record<string, ReactNode> = {
  'talent-scout': <UserSearch className="w-5 h-5" />,
  'culture-sentinel': <HeartPulse className="w-5 h-5" />,
  'retention-analyst': <TrendingUp className="w-5 h-5" />,
  'onboarding-agent': <Rocket className="w-5 h-5" />,
  'performance-coach': <ShieldCheck className="w-5 h-5" />,
  'chro-copilot': <Brain className="w-5 h-5" />,
};

const defaultAgents: Omit<Agent, 'lastActionTimestamp' | 'totalProcessed'>[] = [
  {
    id: 'talent-scout',
    name: 'Talent Scout',
    description: 'End-to-end recruitment & screening automation',
    status: 'active',
    confidence: 0,
    accuracy: 0,
    actionsToday: 0,
    lastAction: 'Awaiting API connection',
    capabilities: ['Resume Parsing', 'Candidate Ranking', 'Bias Check', 'Interview Scheduling'],
  },
  {
    id: 'culture-sentinel',
    name: 'Culture Sentinel',
    description: 'Engagement, sentiment & culture intelligence',
    status: 'active',
    confidence: 0,
    accuracy: 0,
    actionsToday: 0,
    lastAction: 'Awaiting API connection',
    capabilities: ['Pulse Surveys', 'Sentiment Analysis', 'Burnout Detection', 'Culture Metrics'],
  },
  {
    id: 'retention-analyst',
    name: 'Retention Analyst',
    description: 'Attrition prediction & intervention planning',
    status: 'active',
    confidence: 0,
    accuracy: 0,
    actionsToday: 0,
    lastAction: 'Awaiting API connection',
    capabilities: ['Risk Scoring', 'Exit Prediction', 'Intervention Alerts', 'Trend Analysis'],
  },
  {
    id: 'onboarding-agent',
    name: 'Onboarding Agent',
    description: 'Automated onboarding workflows & task management',
    status: 'active',
    confidence: 0,
    accuracy: 0,
    actionsToday: 0,
    lastAction: 'Awaiting API connection',
    capabilities: ['Workflow Builder', 'Task Automation', 'Welcome Kits', 'Training Maps'],
  },
  {
    id: 'performance-coach',
    name: 'Performance Coach',
    description: 'Goals, reviews & feedback automation',
    status: 'active',
    confidence: 0,
    accuracy: 0,
    actionsToday: 0,
    lastAction: 'Awaiting API connection',
    capabilities: ['OKR Tracking', 'Review Generation', 'Skill Gap Analysis', '360 Feedback'],
  },
  {
    id: 'chro-copilot',
    name: 'CHRO Copilot',
    description: 'Strategic HR intelligence & executive insights',
    status: 'active',
    confidence: 0,
    accuracy: 0,
    actionsToday: 0,
    lastAction: 'Awaiting API connection',
    capabilities: ['Board Reports', 'Workforce Planning', 'Scenario Analysis', 'Compliance Monitoring'],
  },
];

export default function AIAgents() {
  const { agents, setAgents, isLoading } = useAgentStore();

  const agentQuery = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      try {
        const data = await agentsService.getAgents();
        setAgents(data);
        return data;
      } catch {
        return null;
      }
    },
  });

  const displayAgents = agents.length > 0 ? agents : defaultAgents;
  const loading = agentQuery.isLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">AI Agents</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your 6 AI agents
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status="success" label="All Systems Operational" />
            <Button variant="outline" size="sm" onClick={() => agentQuery.refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">6</p>
                <p className="text-xs text-muted-foreground">Total Agents</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">—</p>
                <p className="text-xs text-muted-foreground">Actions Today</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <ShieldCheck className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">—</p>
                <p className="text-xs text-muted-foreground">Avg Accuracy</p>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Brain className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">—</p>
                <p className="text-xs text-muted-foreground">Total Processed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Cards */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-4">Agent Fleet</h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card-elevated p-5 space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayAgents.map((agent) => (
                <div key={agent.id} className="card-elevated p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        {agentIcons[agent.id] || <Bot className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{agent.name}</h4>
                        <p className="text-xs text-muted-foreground">{agent.description}</p>
                      </div>
                    </div>
                    <StatusBadge
                      status={agent.status === 'active' ? 'active' : agent.status === 'processing' ? 'warning' : 'pending'}
                      label={agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      size="sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium text-foreground">{agent.confidence}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${agent.confidence}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-medium text-foreground">{agent.accuracy}%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Actions Today</span>
                      <span className="font-medium text-foreground">{agent.actionsToday}</span>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Capabilities</p>
                      <div className="flex flex-wrap gap-1.5">
                        {agent.capabilities.slice(0, 3).map((cap) => (
                          <span key={cap} className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">{cap}</span>
                        ))}
                        {agent.capabilities.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">+{agent.capabilities.length - 3}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3">
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                        <Settings className="w-3 h-3 mr-1.5" />
                        Configure
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        {agent.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity */}
        <div className="card-elevated p-5">
          <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Activity logs will populate when API is connected</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
