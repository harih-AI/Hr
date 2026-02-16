import { useEffect } from "react";
import {
    ArrowUpRight,
    Calendar,
    FileCheck,
    MessageSquare,
    Trophy,
    Activity,
    ChevronRight,
    Sparkles
} from "lucide-react";
import CandidateLayout from "@/components/layout/CandidateLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useInterviewStore } from "@/store/useInterviewStore";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/candidate/StatusBadge";
import { useProfileStore } from "@/store/useProfileStore";
import { Video } from "lucide-react";
import { Link } from "react-router-dom";

export default function CandidateDashboard() {
    const { user } = useAuthStore();
    const { applications, fetchApplications } = useApplicationStore();
    const { interviews, fetchInterviews } = useInterviewStore();
    const { profile, fetchProfile } = useProfileStore();

    useEffect(() => {
        fetchApplications();
        fetchInterviews();
        fetchProfile();
    }, [fetchApplications, fetchInterviews, fetchProfile]);

    const stats = [
        { label: "Applications", value: applications.length, icon: FileCheck, color: "text-[#8017E1]" },
        { label: "Interviews", value: interviews.length, icon: Calendar, color: "text-[#5DA87A]" },
        { label: "Messages", value: 3, icon: MessageSquare, color: "text-blue-500" },
        { label: "Offers", value: 1, icon: Trophy, color: "text-amber-500" },
    ];

    return (
        <CandidateLayout>
            <div className="space-y-8">
                {/* Header */}
                <header>
                    <h1 className="text-3xl font-bold text-[#2B2E33]">Welcome back, {user?.name || "Alex"}</h1>
                    <p className="text-[#7B7F85] mt-1">Here's what's happening with your applications today.</p>
                </header>

                {/* Interview Notification Card - Only for Approved/Interviewing */}
                {(profile?.status === 'Approved' || profile?.status === 'Interviewing') && (
                    <div className="bg-gradient-to-r from-[#8017E1] to-[#6a11cb] rounded-2xl p-6 text-white shadow-lg animate-in slide-in-from-top duration-500">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <Video className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">🎉 Congratulations! HR has approved you!</h3>
                                    <p className="text-purple-100 text-sm">You've been moved to the next stage. Please complete your AI interview.</p>
                                </div>
                            </div>
                            <Link to="/candidate/ai-interview?jobId=job_01">
                                <Button className="bg-white text-[#8017E1] hover:bg-white/90 font-bold px-6">
                                    Start Interview Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white border border-[#C1C4C8] rounded-xl p-6 flex items-center gap-4">
                            <div className={`p-3 rounded-lg bg-[#F5F6F7]`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#7B7F85]">{stat.label}</p>
                                <p className="text-2xl font-bold text-[#2B2E33]">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Applications */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#2B2E33]">Recent Applications</h2>
                            <Button variant="ghost" className="text-[#8017E1] h-8 px-2 font-semibold">
                                View All <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                        <div className="bg-white border border-[#C1C4C8] rounded-xl overflow-hidden">
                            <div className="divide-y divide-[#C1C4C8]">
                                {applications.slice(0, 3).map((app) => (
                                    <div key={app.id} className="p-4 flex items-center justify-between hover:bg-[#F5F6F7] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[#8017E1]/10 flex items-center justify-center font-bold text-[#8017E1]">
                                                {app.company[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#2B2E33]">{app.jobTitle}</p>
                                                <p className="text-sm text-[#7B7F85]">{app.company} • Applied {app.appliedDate.split('T')[0]}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <StatusBadge status={app.status} />
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7B7F85]"><ArrowUpRight className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Insights & Alerts */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-[#2B2E33]">AI Insights</h2>
                        <div className="bg-[#8017E1] rounded-xl p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="w-5 h-5 text-purple-200" />
                                    <span className="text-sm font-semibold text-purple-100 uppercase tracking-wider">Market Analysis</span>
                                </div>
                                <p className="text-lg font-medium leading-relaxed">
                                    Your profile is in the top 5% for Frontend Architect roles this week.
                                </p>
                                <Button className="mt-6 bg-white text-[#8017E1] hover:bg-gray-100 font-bold border-none shadow-none">
                                    Optimize Profile
                                </Button>
                            </div>
                            {/* Decorative Sparkle */}
                            <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
                        </div>

                        <div className="bg-white border border-[#C1C4C8] rounded-xl p-6">
                            <h3 className="font-bold text-[#2B2E33] mb-4">Upcoming Interview</h3>
                            {interviews.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-[#F5F6F7] flex flex-col items-center justify-center text-center">
                                            <span className="text-[10px] font-bold text-[#7B7F85] uppercase">Mar</span>
                                            <span className="text-lg font-bold text-[#2B2E33]">20</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#2B2E33]">{interviews[0].type}</p>
                                            <p className="text-xs text-[#7B7F85]">{interviews[0].startTime.split('T')[1].substring(0, 5)} • {interviews[0].location}</p>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-[#5DA87A] hover:bg-[#5DA87A]/90 font-bold">Join Meeting</Button>
                                </div>
                            ) : (
                                <p className="text-sm text-[#7B7F85]">No interviews scheduled yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
