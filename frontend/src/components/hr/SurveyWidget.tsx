import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

interface SurveyWidgetProps {
  title: string;
  score: number;
  maxScore?: number;
  responses: number;
  trend?: number;
  type?: "enps" | "pulse" | "engagement";
  className?: string;
}

export function SurveyWidget({
  title,
  score,
  maxScore = 100,
  responses,
  trend,
  type = "enps",
  className,
}: SurveyWidgetProps) {
  const getScoreColor = () => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 70) return "text-success";
    if (percentage >= 40) return "text-warning";
    return "text-destructive";
  };

  const getScoreIcon = () => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 70) return <ThumbsUp className="w-4 h-4" />;
    if (percentage >= 40) return <Minus className="w-4 h-4" />;
    return <ThumbsDown className="w-4 h-4" />;
  };

  return (
    <div className={cn("card-elevated p-4", className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{type}</p>
          <h4 className="text-sm font-semibold text-foreground mt-0.5">{title}</h4>
        </div>
        <div className={cn("p-2 rounded-lg", getScoreColor(), "bg-current/10")}>
          {getScoreIcon()}
        </div>
      </div>
      
      <div className="flex items-end gap-2">
        <span className={cn("text-3xl font-bold", getScoreColor())}>{score}</span>
        <span className="text-sm text-muted-foreground mb-1">/ {maxScore}</span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {responses.toLocaleString()} responses
        </span>
        {trend !== undefined && (
          <span className={cn(
            "text-xs font-medium",
            trend > 0 && "text-success",
            trend < 0 && "text-destructive",
            trend === 0 && "text-muted-foreground"
          )}>
            {trend > 0 ? "+" : ""}{trend}% vs last
          </span>
        )}
      </div>
    </div>
  );
}