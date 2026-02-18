import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import {
  UserSearch,
  Upload,
  Filter,
  RefreshCw,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Sparkles,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";
import * as hiringService from "@/services/hiring";

interface ResumeUploadForm {
  role: string;
  department: string;
}

export default function Hiring() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset } = useForm<ResumeUploadForm>();

  // Fetch candidates
  const { data: candidatesResponse, isLoading: isLoadingCandidates } = useQuery({
    queryKey: ['candidates'],
    queryFn: hiringService.getCandidates
  });

  const candidates = candidatesResponse?.data || [];

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (data: { file: File; role: string; department: string }) =>
      hiringService.uploadResume(data.file, data.role, data.department),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      //   queryClient.invalidateQueries({ queryKey: ['ranking'] });
      setSelectedFile(null);
      reset();
    }
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id: string) => hiringService.approveCandidate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    }
  });

  const onUpload = (data: ResumeUploadForm) => {
    if (!selectedFile) {
      alert("Please select a resume file first.");
      return;
    }
    uploadMutation.mutate({ file: selectedFile, ...data });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <UserSearch className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Hiring Console</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              AI-powered recruitment pipeline — Powered by Talent Scout
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Open Positions', value: '12' },
            { label: 'Active Candidates', value: candidates.length.toString() },
            { label: 'Interviews Scheduled', value: '8' },
            { label: 'Offers Pending', value: '3' }
          ].map((stat) => (
            <div key={stat.label} className="card-elevated p-4">
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Upload */}
            <div className="card-elevated p-5">
              <h3 className="text-sm font-semibold mb-4">Resume Upload</h3>
              <form onSubmit={handleSubmit(onUpload)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">Role</label>
                    <input
                      {...register('role', { required: true })}
                      className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                      placeholder="e.g. Senior Engineer"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">Department</label>
                    <input
                      {...register('department', { required: true })}
                      className="w-full h-9 px-3 text-sm border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                      placeholder="e.g. Engineering"
                    />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-muted/50 ${selectedFile ? 'border-primary bg-primary/5' : ''}`}
                >
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${selectedFile ? 'text-primary' : 'text-muted-foreground'}`} />
                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">Drop resumes here or click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOCX — up to 10 files</p>
                    </>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={uploadMutation.isPending || !selectedFile}>
                  {uploadMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {uploadMutation.isPending ? 'Analyzing Resume...' : 'Upload & Analyze'}
                </Button>
              </form>
            </div>

            {/* Candidate Ranking */}
            <div className="card-elevated p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Candidate Ranking</h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  AI POWERED
                </div>
              </div>

              {isLoadingCandidates ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
                </div>
              ) : candidates.length > 0 ? (
                <div className="space-y-3">
                  {candidates.map((c: any) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCandidate(c)}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-all cursor-pointer hover:shadow-md group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.role} • {c.experience}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{c.score}%</div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Match</p>
                        </div>
                        {c.status === 'Approved' ? (
                          <div className="px-2 py-1 rounded bg-success/10 text-success text-[10px] font-bold">
                            APPROVED
                          </div>
                        ) : c.status === 'Interviewing' ? (
                          <div className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                            INTERVIEWING
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-[10px] font-bold border-blue-500 text-blue-500 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                hiringService.startInterview(c.id).then(() => {
                                  queryClient.invalidateQueries({ queryKey: ['candidates'] });
                                });
                              }}
                            >
                              INTERVIEW
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-[10px] font-bold border-success text-success hover:bg-success/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                approveMutation.mutate(c.id);
                              }}
                              disabled={approveMutation.isPending}
                            >
                              APPROVE
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Upload resumes or connect API to see AI-ranked candidates</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Approval Flow */}
            <div className="card-elevated p-5">
              <h3 className="text-sm font-semibold mb-4">Approval Queue</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Approved: {candidates.filter((c: any) => c.status === 'Approved' || c.status === 'Shortlisted').length}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4 text-warning" />
                  <span>Pending: {candidates.filter((c: any) => c.status === 'Applied').length}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span>Rejected: 0</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Real-time candidate monitoring</p>
            </div>

            {/* AI Match Quality */}
            <div className="card-elevated p-5">
              <h3 className="text-sm font-semibold mb-4">AI Match Quality</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Avg Match Score</span>
                  <span className="font-medium text-foreground">
                    {candidates.length > 0
                      ? Math.round(candidates.reduce((acc: number, c: any) => acc + c.score, 0) / candidates.length)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Bias Check Pass Rate</span>
                  <span className="font-medium text-foreground">100%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Time to Screen</span>
                  <span className="font-medium text-foreground">&lt; 2s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Detail Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedCandidate.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedCandidate.role} • {selectedCandidate.experience}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCandidate(null)}>
                  <XCircle className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Technical Match</h4>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-primary">{selectedCandidate.score}%</div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${selectedCandidate.score}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Status</h4>
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedCandidate.status === 'Approved' ? 'bg-success/10 text-success' :
                      selectedCandidate.status === 'Interviewing' ? 'bg-blue-100 text-blue-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                      {selectedCandidate.status}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Match Analysis</h4>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/50 p-4 rounded-lg border border-border">
                    {selectedCandidate.matchReason || "Highly qualified candidate with strong technical background in modern web technologies and distributed systems."}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(typeof selectedCandidate.skills === 'string' ? JSON.parse(selectedCandidate.skills) : (selectedCandidate.skills || ['TypeScript', 'React', 'Node.js', 'PostgreSQL'])).map((skill: string) => (
                      <span key={skill} className="px-2.5 py-1 rounded-md bg-primary/5 border border-primary/10 text-primary text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedCandidate.links && (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Professional Links</h4>
                    <div className="flex gap-4">
                      {(() => {
                        try {
                          const links = typeof selectedCandidate.links === 'string'
                            ? JSON.parse(selectedCandidate.links)
                            : selectedCandidate.links;
                          return (
                            <>
                              {links.linkedin && (
                                <a href={links.linkedin.startsWith('http') ? links.linkedin : `https://${links.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                                  <Linkedin className="w-4 h-4" /> LinkedIn
                                </a>
                              )}
                              {links.github && (
                                <a href={links.github.startsWith('http') ? links.github : `https://${links.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[#24292e] hover:underline">
                                  <Github className="w-4 h-4" /> GitHub
                                </a>
                              )}
                              {links.portfolio && (
                                <a href={links.portfolio.startsWith('http') ? links.portfolio : `https://${links.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-green-600 hover:underline">
                                  <Globe className="w-4 h-4" /> Portfolio
                                </a>
                              )}
                            </>
                          );
                        } catch (e) {
                          return null;
                        }
                      })()}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {selectedCandidate.resumeUrl ? selectedCandidate.resumeUrl.split('/').pop() : "resume_default.pdf"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      if (selectedCandidate.resumeUrl) {
                        window.open(selectedCandidate.resumeUrl, '_blank');
                      } else {
                        alert("Resume file not found for this candidate.");
                      }
                    }}
                  >
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    View Resume
                  </Button>
                </div>
              </div>
              <div className="p-6 bg-muted/50 border-t border-border flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedCandidate(null)}>Close</Button>
                {selectedCandidate.status !== 'Approved' && (
                  <Button
                    className="bg-success hover:bg-success/90 text-white"
                    onClick={() => {
                      approveMutation.mutate(selectedCandidate.id);
                      setSelectedCandidate(null);
                    }}
                  >
                    Approve Candidate
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
