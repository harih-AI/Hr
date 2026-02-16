import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { reportsService } from "@/services/reports";
import {
  BarChart3,
  FileText,
  Download,
  RefreshCw,
  TrendingUp,
  Brain,
  Layers,
} from "lucide-react";

export default function Executive() {
  const reportsQuery = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      try { return await reportsService.getReports(); } catch { return null; }
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Executive Command</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Strategic reports, forecasts & scenarios — Powered by CHRO Copilot
            </p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Generate Report', icon: <FileText className="w-4 h-4" /> },
            { label: 'Run Forecast', icon: <TrendingUp className="w-4 h-4" /> },
            { label: 'Scenario Builder', icon: <Layers className="w-4 h-4" /> },
            { label: 'Export Data', icon: <Download className="w-4 h-4" /> },
          ].map((action) => (
            <Button key={action.label} variant="outline" className="card-elevated h-auto p-4 flex flex-col items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">{action.icon}</div>
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Reports */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Reports</h3>
            {reportsQuery.data && reportsQuery.data.length > 0 ? (
              <div className="space-y-3">
                {reportsQuery.data.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{report.title}</p>
                      <p className="text-xs text-muted-foreground">{report.generatedAt}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Reports load from API</p>
              </div>
            )}
          </div>

          {/* Forecasts */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Workforce Forecasts</h3>
            <div className="text-center py-8">
              <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Connect API to view workforce forecasts</p>
            </div>
          </div>

          {/* Scenarios */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Scenario Analysis</h3>
            <div className="text-center py-8">
              <Layers className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Connect API to run scenario analysis</p>
            </div>
          </div>

          {/* Export */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Export Center</h3>
            <div className="space-y-3">
              {['PDF Report', 'CSV Data Export', 'Board Deck (PPTX)'].map((format) => (
                <Button key={format} variant="outline" className="w-full justify-start h-9 text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  {format}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
