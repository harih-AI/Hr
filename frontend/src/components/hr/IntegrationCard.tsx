import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  className?: string;
  onConfigure?: () => void;
}

export function IntegrationCard({
  name,
  description,
  icon,
  status,
  lastSync,
  className,
  onConfigure,
}: IntegrationCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return { label: "Connected", type: "success" as const };
      case "disconnected":
        return { label: "Disconnected", type: "pending" as const };
      case "error":
        return { label: "Error", type: "error" as const };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={cn("card-interactive p-4", className)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-foreground">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
            <StatusBadge status={statusConfig.type} label={statusConfig.label} size="sm" />
          </div>
          <div className="flex items-center justify-between mt-3">
            {lastSync && (
              <span className="text-xs text-muted-foreground">
                Last sync: {lastSync}
              </span>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <ExternalLink className="w-3 h-3 mr-1.5" />
                Docs
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onConfigure}>
                <Settings className="w-3 h-3 mr-1.5" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}