import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  status: "completed" | "current" | "upcoming";
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex gap-4">
          {/* Line */}
          {index < items.length - 1 && (
            <div
              className={cn(
                "absolute left-[15px] top-8 w-0.5 h-[calc(100%-8px)]",
                item.status === "completed" ? "bg-success" : "bg-border"
              )}
            />
          )}
          
          {/* Icon */}
          <div
            className={cn(
              "relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              item.status === "completed" && "bg-success text-success-foreground",
              item.status === "current" && "bg-verified text-verified-foreground",
              item.status === "upcoming" && "bg-muted text-muted-foreground"
            )}
          >
            {item.status === "completed" ? (
              <Check className="w-4 h-4" />
            ) : item.icon ? (
              item.icon
            ) : (
              <Circle className="w-3 h-3" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    item.status === "upcoming" ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {item.timestamp}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}