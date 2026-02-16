import { DashboardLayout } from "@/components/layout";
import { MetricCard, AIInsightPanel, OrgHeatmap, RiskMeter, InterviewResults } from "@/components/hr";
import { useDashboardStore } from "@/store/dashboardStore";
import { dashboardService } from "@/services/dashboard";
import { interviewService } from "@/services/interview";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Bot,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function KPISkeletons() {
  return (
    <div className="grid-dashboard">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card-elevated p-5 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="card-elevated p-5">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-3 w-48 mb-4" />
      <Skeleton className="h-[240px] w-full" />
    </div>
  );
}

function InterviewResultsSection() {
  const { data: results, isLoading } = useQuery({
    queryKey: ['interview-results'],
    queryFn: interviewService.getAll,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="card-elevated p-5">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-24 w-full mb-3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return <InterviewResults results={results || []} />;
}

const defaultKPIIcons = [
  <Users className="w-5 h-5" />,
  <Clock className="w-5 h-5" />,
  <TrendingUp className="w-5 h-5" />,
  <DollarSign className="w-5 h-5" />,
];

export default function Dashboard() {
  const store = useDashboardStore();
  const kpis = store.kpis || [];
  const health = store.health || [];
  const insights = store.insights || [];
  const { setKPIs, setHealth, setInsights } = store;

  const kpiQuery = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      try {
        const data = await dashboardService.getKPIs();
        setKPIs(data);
        return data;
      } catch {
        return null;
      }
    },
  });

  const healthQuery = useQuery({
    queryKey: ['dashboard-health'],
    queryFn: async () => {
      try {
        const data = await dashboardService.getHealth();
        setHealth(data);
        return data;
      } catch {
        return null;
      }
    },
  });

  const insightsQuery = useQuery({
    queryKey: ['dashboard-insights'],
    queryFn: async () => {
      try {
        const data = await dashboardService.getInsights();
        setInsights(data);
        return data;
      } catch {
        return null;
      }
    },
  });

  const hiringChartQuery = useQuery({
    queryKey: ['dashboard-chart-hiring'],
    queryFn: async () => {
      try {
        return await dashboardService.getChartData('hiring');
      } catch {
        return null;
      }
    },
  });

  const attritionChartQuery = useQuery({
    queryKey: ['dashboard-chart-attrition'],
    queryFn: async () => {
      try {
        return await dashboardService.getChartData('attrition');
      } catch {
        return null;
      }
    },
  });

  const isKPILoading = kpiQuery.isLoading;
  const isChartLoading = hiringChartQuery.isLoading || attritionChartQuery.isLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            AI Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time workforce intelligence powered by 6 AI agents
          </p>
        </div>

        {/* KPI Cards */}
        {isKPILoading ? (
          <KPISkeletons />
        ) : kpis.length > 0 ? (
          <div className="grid-dashboard">
            {kpis.map((kpi, i) => (
              <MetricCard
                key={kpi.id}
                title={kpi.title}
                value={kpi.value}
                subtitle={kpi.subtitle}
                trend={kpi.trend}
                icon={defaultKPIIcons[i % defaultKPIIcons.length]}
                status={kpi.status}
              />
            ))}
          </div>
        ) : (
          <div className="grid-dashboard">
            <MetricCard title="Total Workforce" value="—" subtitle="Awaiting API" icon={<Users className="w-5 h-5" />} status="neutral" />
            <MetricCard title="Time to Hire" value="—" subtitle="Awaiting API" icon={<Clock className="w-5 h-5" />} status="neutral" />
            <MetricCard title="Engagement Score" value="—" subtitle="Awaiting API" icon={<TrendingUp className="w-5 h-5" />} status="neutral" />
            <MetricCard title="Cost per Hire" value="—" subtitle="Awaiting API" icon={<DollarSign className="w-5 h-5" />} status="neutral" />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            {isChartLoading ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : (
              <>
                <div className="card-elevated p-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold">Hiring Pipeline</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Data loads from API — connect backend to populate
                    </p>
                  </div>
                  <div className="h-[240px] flex items-center justify-center text-muted-foreground text-sm">
                    {hiringChartQuery.data ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={hiringChartQuery.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                          <Bar dataKey="applications" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="hires" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p>Connect API to load hiring pipeline data</p>
                    )}
                  </div>
                </div>

                <div className="card-elevated p-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold">Attrition Trend</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Monthly attrition rate (%)
                    </p>
                  </div>
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                    {attritionChartQuery.data ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={attritionChartQuery.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} domain={[0, 3]} />
                          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                          <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <p>Connect API to load attrition data</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Org Heatmap */}
            {health.length > 0 ? (
              <OrgHeatmap departments={health.map(h => ({ id: h.id, name: h.department, health: h.health, headcount: h.headcount, growth: h.growth }))} />
            ) : (
              <div className="card-elevated p-5">
                <h3 className="text-sm font-semibold mb-2">Department Health</h3>
                <p className="text-sm text-muted-foreground">Connect API to load department health data</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {insights && insights.length > 0 ? (
              <AIInsightPanel insights={insights.map(insight => ({ ...insight, priority: insight.priority as 'high' | 'medium' | 'low' | undefined }))} />
            ) : (
              <div className="card-elevated p-5">
                <h3 className="text-sm font-semibold mb-2">AI Insights</h3>
                <p className="text-sm text-muted-foreground">Insights will appear when API is connected</p>
              </div>
            )}

            <div className="card-elevated p-5 space-y-4">
              <h3 className="text-sm font-semibold">Risk Assessment</h3>
              <RiskMeter value={0} label="Attrition Risk" />
              <RiskMeter value={0} label="Compliance Risk" />
              <RiskMeter value={0} label="Skill Gap Risk" />
              <p className="text-xs text-muted-foreground">Risk data loads from API</p>
            </div>
          </div>
        </div>

        {/* Agent Status Summary */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Agent Fleet Status</h2>
          </div>
          <p className="text-sm text-muted-foreground">Connect to API to view real-time agent statuses</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
