import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Bot, MoreVertical, Activity, History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAgentCardProps {
  name: string;
  description: string;
  status: "active" | "idle" | "processing";
  confidence: number;
  actionsToday: number;
  lastAction?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function AIAgentCard({
  name,
  description,
  status,
  confidence,
  actionsToday,
  lastAction,
  icon,
  className,
}: AIAgentCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return { label: "Active", type: "active" as const };
      case "processing":
        return { label: "Processing", type: "warning" as const };
      case "idle":
        return { label: "Idle", type: "pending" as const };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={cn("card-interactive p-5", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-verified/10 text-verified">
            {icon || <Bot className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Status</span>
          <StatusBadge status={statusConfig.type} label={statusConfig.label} size="sm" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Confidence</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground">{confidence}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Activity className="w-3.5 h-3.5" />
            <span>Actions Today</span>
          </div>
          <span className="text-xs font-semibold text-foreground">{actionsToday}</span>
        </div>

        {lastAction && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <History className="w-3.5 h-3.5" />
              <span className="truncate">{lastAction}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}