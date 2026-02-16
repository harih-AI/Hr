import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CandidateLayout from "@/components/layout/CandidateLayout";
import { useInterviewStore } from "@/store/useInterviewStore";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Video, FileText, Sparkles, ChevronRight } from "lucide-react";

export default function Interviews() {
    const navigate = useNavigate();
    const { interviews, fetchInterviews, isLoading } = useInterviewStore();

    useEffect(() => {
        fetchInterviews();
    }, [fetchInterviews]);

    return (
        <CandidateLayout>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-[#2B2E33]">Interviews</h1>
                    <p className="text-[#7B7F85] mt-1">Prepare for your upcoming sessions with AI insights.</p>
                </header>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-48 rounded-xl skeleton" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-[#2B2E33]">Upcoming Schedule</h2>
                            {interviews.map((interview) => (
                                <div key={interview.id} className="bg-white border border-[#C1C4C8] rounded-2xl overflow-hidden group">
                                    <div className="p-6 border-b border-[#C1C4C8] flex justify-between items-start bg-gray-50/50">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#2B2E33]">{interview.type}</h3>
                                            <p className="text-[#7B7F85]">{interview.jobTitle} • {interview.company}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-white border border-[#C1C4C8] flex flex-col items-center justify-center">
                                            <span className="text-[10px] font-bold text-[#7B7F85] uppercase">Mar</span>
                                            <span className="text-xl font-bold text-[#2B2E33]">20</span>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 text-sm text-[#7B7F85]">
                                                <Clock className="w-4 h-4 text-[#8017E1]" />
                                                {new Date(interview.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({interview.duration}m)
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-[#7B7F85]">
                                                <Video className="w-4 h-4 text-[#8017E1]" />
                                                {interview.location}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-[#7B7F85] col-span-2">
                                                <User className="w-4 h-4 text-[#8017E1]" />
                                                With {interview.interviewer}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                className="flex-1 bg-[#8017E1] hover:bg-[#8017E1]/90 font-bold shadow-[0_0_15px_rgba(128,23,225,0.3)] animate-pulse"
                                                onClick={() => {
                                                    console.log("Navigating to AI interview for job:", interview.id);
                                                    navigate(`/candidate/ai-interview?jobId=${interview.id}`);
                                                }}
                                            >
                                                <Video className="w-4 h-4 mr-2" />
                                                Join AI Interview
                                            </Button>
                                            <Button variant="outline" className="flex-1 border-[#C1C4C8] font-bold">Reschedule</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-[#2B2E33]">AI Preparation Panel</h2>
                            {interviews.length > 0 && (
                                <div className="space-y-6">
                                    <div className="bg-[#8017E1] rounded-2xl p-8 text-white">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Sparkles className="w-6 h-6" />
                                            <h3 className="text-lg font-bold">Smart Insights</h3>
                                        </div>
                                        <div className="space-y-6">
                                            <section>
                                                <p className="text-xs font-bold text-purple-200 uppercase tracking-widest mb-3">Focus Areas</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {interviews[0].aiInsights.focusAreas.map((area: string) => (
                                                        <span key={area} className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20">
                                                            {area}
                                                        </span>
                                                    ))}
                                                </div>
                                            </section>
                                            <section>
                                                <p className="text-xs font-bold text-purple-200 uppercase tracking-widest mb-3">Predicted Questions</p>
                                                <ul className="space-y-3">
                                                    {interviews[0].aiInsights.likelyQuestions.map((q: string, i: number) => (
                                                        <li key={i} className="flex gap-3 text-sm leading-relaxed p-3 rounded-lg bg-white/5 border border-white/10">
                                                            <div className="w-5 h-5 rounded bg-white text-[#8017E1] flex-shrink-0 flex items-center justify-center font-bold text-xs">{i + 1}</div>
                                                            {q}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-[#C1C4C8] rounded-2xl p-6">
                                        <h3 className="font-bold text-[#2B2E33] mb-4">Prep Materials</h3>
                                        <div className="space-y-3">
                                            {interviews[0].prepMaterials.map((mat: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#C1C4C8] hover:border-[#8017E1] transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-[#7B7F85] group-hover:text-[#8017E1]" />
                                                        <span className="text-sm font-medium text-[#2B2E33]">{mat.title}</span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-[#C1C4C8]" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </CandidateLayout>
    );
}
