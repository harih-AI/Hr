import { cn } from "@/lib/utils";
import { Sparkles, AlertTriangle, TrendingUp, Clock } from "lucide-react";

interface Insight {
  id: string;
  type: "alert" | "recommendation" | "trend" | "info";
  title: string;
  description: string;
  timestamp?: string;
  priority?: "high" | "medium" | "low";
}

interface AIInsightPanelProps {
  title?: string;
  insights: Insight[];
  className?: string;
}

export function AIInsightPanel({
  title = "AI Insights",
  insights,
  className,
}: AIInsightPanelProps) {
  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-4 h-4" />;
      case "recommendation":
        return <Sparkles className="w-4 h-4" />;
      case "trend":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getIconStyle = (type: Insight["type"]) => {
    switch (type) {
      case "alert":
        return "bg-destructive/10 text-destructive";
      case "recommendation":
        return "bg-success/10 text-success";
      case "trend":
        return "bg-verified/10 text-verified";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityStyle = (priority?: Insight["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive";
      case "medium":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className={cn("card-elevated", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-success/10">
            <Sparkles className="w-4 h-4 text-success" />
          </div>
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
      </div>
      <div className="divide-y divide-border">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex gap-3">
              <div
                className={cn(
                  "flex-shrink-0 p-2 rounded-lg",
                  getIconStyle(insight.type)
                )}
              >
                {getIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {insight.title}
                  </p>
                  {insight.priority && (
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0",
                        getPriorityStyle(insight.priority)
                      )}
                    >
                      {insight.priority}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {insight.description}
                </p>
                {insight.timestamp && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {insight.timestamp}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}