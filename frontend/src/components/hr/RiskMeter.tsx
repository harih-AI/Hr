import { cn } from "@/lib/utils";

interface RiskMeterProps {
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function RiskMeter({
  value,
  label,
  size = "md",
  showLabel = true,
  className,
}: RiskMeterProps) {
  const getRiskLevel = () => {
    if (value <= 30) return { label: "Low", color: "bg-success" };
    if (value <= 60) return { label: "Medium", color: "bg-warning" };
    return { label: "High", color: "bg-destructive" };
  };

  const riskLevel = getRiskLevel();

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label || "Risk Level"}</span>
          <span className={cn(
            "text-xs font-medium",
            value <= 30 && "text-success",
            value > 30 && value <= 60 && "text-warning",
            value > 60 && "text-destructive"
          )}>
            {riskLevel.label} ({value}%)
          </span>
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", riskLevel.color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}