import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Mail, Phone, Building2 } from "lucide-react";

interface EmployeeCardProps {
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  status: "active" | "on-leave" | "remote";
  avatar?: string;
  className?: string;
}

export function EmployeeCard({
  name,
  role,
  department,
  email,
  phone,
  status,
  avatar,
  className,
}: EmployeeCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return { label: "Active", type: "success" as const };
      case "on-leave":
        return { label: "On Leave", type: "warning" as const };
      case "remote":
        return { label: "Remote", type: "active" as const };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={cn("card-interactive p-4", className)}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <span className="text-lg font-semibold text-muted-foreground">
              {name.split(" ").map((n) => n[0]).join("")}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{name}</h4>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
            <StatusBadge status={statusConfig.type} label={statusConfig.label} size="sm" />
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="w-3.5 h-3.5" />
              <span>{department}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate">{email}</span>
            </div>
            {phone && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}