import { cn } from "@/lib/utils";
import { Check, AlertCircle, Clock, Zap } from "lucide-react";

type StatusType = "success" | "warning" | "error" | "pending" | "active";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  showIcon?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({
  status,
  label,
  showIcon = true,
  size = "md",
  className,
}: StatusBadgeProps) {
  const getIcon = () => {
    switch (status) {
      case "success":
        return <Check className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />;
      case "warning":
        return <AlertCircle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />;
      case "error":
        return <AlertCircle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />;
      case "pending":
        return <Clock className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />;
      case "active":
        return <Zap className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    }
  };

  const getStyles = () => {
    switch (status) {
      case "success":
        return "bg-success/10 text-success border-success/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "pending":
        return "bg-muted text-muted-foreground border-border";
      case "active":
        return "bg-verified/10 text-verified border-verified/20";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        getStyles(),
        className
      )}
    >
      {showIcon && getIcon()}
      {label}
    </span>
  );
}