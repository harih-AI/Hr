import { cn } from "@/lib/utils";

interface Department {
  id: string;
  name: string;
  health: number;
  headcount: number;
  growth?: number;
}

interface OrgHeatmapProps {
  departments: Department[];
  title?: string;
  className?: string;
}

export function OrgHeatmap({
  departments,
  title = "Organization Health",
  className,
}: OrgHeatmapProps) {
  const getHealthColor = (health: number) => {
    if (health >= 80) return "bg-success";
    if (health >= 60) return "bg-success/60";
    if (health >= 40) return "bg-warning";
    return "bg-destructive";
  };

  const getHealthBg = (health: number) => {
    if (health >= 80) return "bg-success/10";
    if (health >= 60) return "bg-success/5";
    if (health >= 40) return "bg-warning/10";
    return "bg-destructive/10";
  };

  return (
    <div className={cn("card-elevated", className)}>
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className={cn(
              "p-3 rounded-lg transition-all cursor-pointer hover:shadow-sm",
              getHealthBg(dept.health)
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-2 h-2 rounded-full", getHealthColor(dept.health))} />
              <span className="text-xs font-medium text-foreground truncate">
                {dept.name}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-lg font-semibold text-foreground">{dept.health}%</p>
                <p className="text-xs text-muted-foreground">{dept.headcount} people</p>
              </div>
              {dept.growth !== undefined && (
                <span className={cn(
                  "text-xs font-medium",
                  dept.growth > 0 && "text-success",
                  dept.growth < 0 && "text-destructive",
                  dept.growth === 0 && "text-muted-foreground"
                )}>
                  {dept.growth > 0 ? "+" : ""}{dept.growth}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}