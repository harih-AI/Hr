import { DashboardLayout } from "@/components/layout";
import { RiskMeter } from "@/components/hr";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { peopleService } from "@/services/people";
import {
  Users,
  HeartPulse,
  TrendingUp,
  Brain,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

export default function PeopleIntelligence() {
  const cultureQuery = useQuery({
    queryKey: ['people-culture'],
    queryFn: async () => {
      try { return await peopleService.getCultureMetrics(); } catch { return null; }
    },
  });

  const retentionQuery = useQuery({
    queryKey: ['people-retention'],
    queryFn: async () => {
      try { return await peopleService.getRetentionScores(); } catch { return null; }
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">People Intelligence</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Culture, retention & performance insights — Powered by Culture Sentinel & Retention Analyst
            </p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Culture Score', icon: <HeartPulse className="w-4 h-4 text-primary" /> },
            { label: 'Retention Rate', icon: <TrendingUp className="w-4 h-4 text-success" /> },
            { label: 'Engagement', icon: <BarChart3 className="w-4 h-4 text-primary" /> },
            { label: 'Skill Coverage', icon: <Brain className="w-4 h-4 text-muted-foreground" /> },
          ].map((metric) => (
            <div key={metric.label} className="card-elevated p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">{metric.icon}</div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">—</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Culture Metrics */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Culture Metrics</h3>
            {cultureQuery.isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : cultureQuery.data ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={cultureQuery.data}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                Connect API to load culture metrics
              </div>
            )}
          </div>

          {/* Retention */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Retention Risk Analysis</h3>
            <div className="space-y-4">
              <RiskMeter value={0} label="Engineering" />
              <RiskMeter value={0} label="Sales" />
              <RiskMeter value={0} label="Product" />
              <RiskMeter value={0} label="Operations" />
              <p className="text-xs text-muted-foreground mt-2">Risk scores load from API</p>
            </div>
          </div>

          {/* Performance Charts */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Performance Distribution</h3>
            <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
              Connect API to load performance data
            </div>
          </div>

          {/* Skill Analysis */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Skill Gap Analysis</h3>
            <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
              Connect API to load skill analysis
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
