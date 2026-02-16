// === API Schema Types ===

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Agent Types
export type AgentId = 'talent-scout' | 'culture-sentinel' | 'retention-analyst' | 'onboarding-agent' | 'performance-coach' | 'chro-copilot';

export type AgentStatus = 'active' | 'idle' | 'processing' | 'error';

export interface Agent {
  id: AgentId;
  name: string;
  description: string;
  status: AgentStatus;
  confidence: number;
  accuracy: number;
  actionsToday: number;
  totalProcessed: number;
  lastAction: string;
  lastActionTimestamp: string;
  capabilities: string[];
}

export interface AgentLog {
  id: string;
  agentId: AgentId;
  action: string;
  result: string;
  confidence: number;
  timestamp: string;
  source: string;
  explanation: string;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'auto-approved';
}

export interface AgentMetrics {
  agentId: AgentId;
  period: string;
  accuracy: number;
  actionsCompleted: number;
  avgResponseTime: number;
  errorRate: number;
  satisfactionScore: number;
}

// Dashboard Types
export interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  status: 'success' | 'warning' | 'neutral';
}

export interface HealthMetric {
  id: string;
  department: string;
  health: number;
  headcount: number;
  growth: number;
}

export interface AIInsight {
  id: string;
  type: 'alert' | 'recommendation' | 'trend' | 'info';
  title: string;
  description: string;
  timestamp: string;
  priority?: 'high' | 'medium' | 'low';
  source: string;
  agentId: AgentId;
}

export interface ChartDataPoint {
  label: string;
  [key: string]: string | number;
}

// People Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'on-leave' | 'terminated';
  joinDate: string;
  avatar?: string;
}

export interface CultureMetric {
  id: string;
  metric: string;
  score: number;
  trend: number;
  benchmark: number;
}

export interface RetentionScore {
  employeeId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: string[];
  recommendation: string;
}

// Hiring Types
export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  matchScore: number;
  biasCheck: 'passed' | 'flagged';
  status: 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  resumeUrl?: string;
  appliedDate: string;
}

// Reports Types
export interface Report {
  id: string;
  title: string;
  type: 'forecast' | 'scenario' | 'benchmark' | 'custom';
  generatedAt: string;
  status: 'ready' | 'generating' | 'failed';
  downloadUrl?: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hr-manager' | 'executive' | 'viewer';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Admin Types
export interface Role {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  agentId?: AgentId;
}
