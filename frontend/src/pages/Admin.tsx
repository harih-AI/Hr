import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Users,
  Shield,
  FileText,
  Key,
  RefreshCw,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function Admin() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Admin Panel</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Roles, permissions, audit logs & security
            </p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', icon: <Users className="w-4 h-4 text-primary" />, value: '—' },
            { label: 'Active Roles', icon: <Shield className="w-4 h-4 text-success" />, value: '—' },
            { label: 'Pending Approvals', icon: <Clock className="w-4 h-4 text-warning" />, value: '—' },
            { label: 'MFA Enabled', icon: <Key className="w-4 h-4 text-muted-foreground" />, value: '—' },
          ].map((stat) => (
            <div key={stat.label} className="card-elevated p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">{stat.icon}</div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Roles & Permissions */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Roles & Permissions</h3>
            <div className="space-y-3">
              {['Admin', 'HR Manager', 'Executive', 'Viewer'].map((role) => (
                <div key={role} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{role}</p>
                      <p className="text-xs text-muted-foreground">— users</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Role data loads from API</p>
          </div>

          {/* Audit Logs */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Audit Trail</h3>
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Audit logs load from API</p>
              <p className="text-xs text-muted-foreground mt-1">All AI agent actions are logged with explanations</p>
            </div>
          </div>

          {/* MFA */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Multi-Factor Authentication</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">MFA Enforcement</span>
                <span className="font-medium text-foreground">—</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Enrolled Users</span>
                <span className="font-medium text-foreground">—</span>
              </div>
              <Button variant="outline" className="w-full mt-2">
                <Key className="w-4 h-4 mr-2" />
                Configure MFA
              </Button>
            </div>
          </div>

          {/* Approvals */}
          <div className="card-elevated p-5">
            <h3 className="text-sm font-semibold mb-4">Pending Approvals</h3>
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Approval queue loads from API</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
