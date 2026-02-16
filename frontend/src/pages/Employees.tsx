import { DashboardLayout } from "@/components/layout";
import { EmployeeCard, StatusBadge } from "@/components/hr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  UserPlus,
  Download,
  LayoutGrid,
  List,
} from "lucide-react";
import { useState } from "react";

const employees = [
  {
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    department: "Engineering",
    email: "sarah.chen@company.com",
    phone: "+1 (555) 123-4567",
    status: "active" as const,
  },
  {
    name: "Marcus Thompson",
    role: "Product Manager",
    department: "Product",
    email: "marcus.t@company.com",
    status: "remote" as const,
  },
  {
    name: "Priya Sharma",
    role: "HR Business Partner",
    department: "Human Resources",
    email: "priya.sharma@company.com",
    phone: "+1 (555) 234-5678",
    status: "active" as const,
  },
  {
    name: "James Wilson",
    role: "Sales Director",
    department: "Sales",
    email: "james.w@company.com",
    status: "on-leave" as const,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    department: "Design",
    email: "emily.r@company.com",
    status: "active" as const,
  },
  {
    name: "David Kim",
    role: "Data Scientist",
    department: "Engineering",
    email: "david.kim@company.com",
    status: "remote" as const,
  },
  {
    name: "Lisa Johnson",
    role: "Marketing Manager",
    department: "Marketing",
    email: "lisa.j@company.com",
    status: "active" as const,
  },
  {
    name: "Michael Brown",
    role: "Finance Analyst",
    department: "Finance",
    email: "michael.b@company.com",
    status: "active" as const,
  },
];

export default function Employees() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Employee Directory
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your workforce of {employees.length} employees
            </p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex flex-wrap gap-3">
          <StatusBadge status="success" label={`${employees.filter(e => e.status === "active").length} Active`} />
          <StatusBadge status="active" label={`${employees.filter(e => e.status === "remote").length} Remote`} />
          <StatusBadge status="warning" label={`${employees.filter(e => e.status === "on-leave").length} On Leave`} />
        </div>

        {/* Employee Grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
          }
        >
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.email} {...employee} />
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No employees found matching your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}