import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AIAgents from "./pages/AIAgents";
import Hiring from "./pages/Hiring";
import PeopleIntelligence from "./pages/PeopleIntelligence";
import Executive from "./pages/Executive";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Candidate Portal Pages
import CandidateDashboard from "./pages/candidate/Dashboard";
import JobSearch from "./pages/candidate/Jobs";
import Applications from "./pages/candidate/Applications";
import CandidateProfile from "./pages/candidate/Profile";
import Interviews from "./pages/candidate/Interviews";
import Offers from "./pages/candidate/Offers";
import Onboarding from "./pages/candidate/Onboarding";
import AIInterviewPortal from "./pages/candidate/AIInterviewPortal";
import InterviewResults from "./pages/candidate/InterviewResults";
import CandidateApproval from "./pages/CandidateApproval";
import JobPosting from "./pages/JobPosting";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 2 },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agents" element={<AIAgents />} />
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/people" element={<PeopleIntelligence />} />
          <Route path="/executive" element={<Executive />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/approval" element={<CandidateApproval />} />
          <Route path="/jobs" element={<JobPosting />} />

          {/* Candidate Portal Routes */}
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/jobs" element={<JobSearch />} />
          <Route path="/candidate/applications" element={<Applications />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/interviews" element={<Interviews />} />
          <Route path="/candidate/offers" element={<Offers />} />
          <Route path="/candidate/onboarding" element={<Onboarding />} />
          <Route path="/candidate/ai-interview" element={<AIInterviewPortal />} />
          <Route path="/candidate/interview-results" element={<InterviewResults />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

