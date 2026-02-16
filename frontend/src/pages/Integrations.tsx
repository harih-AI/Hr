import { DashboardLayout } from "@/components/layout";
import { IntegrationCard, StatusBadge } from "@/components/hr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Mail,
  Calendar,
  FileSpreadsheet,
  MessageSquare,
  CreditCard,
  Database,
  Cloud,
  Link2,
} from "lucide-react";

const integrations = [
  {
    name: "Google Workspace",
    description: "Calendar, Drive, and Gmail integration",
    icon: <Mail className="w-5 h-5" />,
    status: "connected" as const,
    lastSync: "5 min ago",
    category: "Productivity",
  },
  {
    name: "Microsoft 365",
    description: "Outlook, Teams, and SharePoint sync",
    icon: <Calendar className="w-5 h-5" />,
    status: "connected" as const,
    lastSync: "2 hours ago",
    category: "Productivity",
  },
  {
    name: "Slack",
    description: "Team messaging and notifications",
    icon: <MessageSquare className="w-5 h-5" />,
    status: "connected" as const,
    lastSync: "1 min ago",
    category: "Communication",
  },
  {
    name: "Stripe",
    description: "Payment processing for payroll",
    icon: <CreditCard className="w-5 h-5" />,
    status: "connected" as const,
    lastSync: "1 hour ago",
    category: "Finance",
  },
  {
    name: "QuickBooks",
    description: "Accounting and expense management",
    icon: <FileSpreadsheet className="w-5 h-5" />,
    status: "disconnected" as const,
    category: "Finance",
  },
  {
    name: "Salesforce",
    description: "CRM integration for sales team data",
    icon: <Cloud className="w-5 h-5" />,
    status: "connected" as const,
    lastSync: "30 min ago",
    category: "CRM",
  },
  {
    name: "Zapier",
    description: "Workflow automation with 5000+ apps",
    icon: <Link2 className="w-5 h-5" />,
    status: "connected" as const,
    lastSync: "10 min ago",
    category: "Automation",
  },
  {
    name: "PostgreSQL",
    description: "Direct database connectivity",
    icon: <Database className="w-5 h-5" />,
    status: "error" as const,
    category: "Database",
  },
];

export default function Integrations() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Integration Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect your HR platform with your favorite tools
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>

        {/* Status Summary */}
        <div className="flex flex-wrap gap-3">
          <StatusBadge 
            status="success" 
            label={`${integrations.filter(i => i.status === "connected").length} Connected`} 
          />
          <StatusBadge 
            status="pending" 
            label={`${integrations.filter(i => i.status === "disconnected").length} Disconnected`} 
          />
          <StatusBadge 
            status="error" 
            label={`${integrations.filter(i => i.status === "error").length} Error`} 
          />
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search integrations..." className="pl-9" />
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <IntegrationCard key={integration.name} {...integration} />
          ))}
        </div>

        {/* API Section */}
        <div className="card-elevated p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">API Access</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Build custom integrations with our REST API
              </p>
            </div>
            <Button variant="outline">View Documentation</Button>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">API Endpoint</p>
            <code className="text-sm text-foreground">https://api.nexushr.ai/v1</code>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}