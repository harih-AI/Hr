import { useEffect, useState } from "react";
import CandidateLayout from "@/components/layout/CandidateLayout";
import { getOnboardingStatus } from "@/services/onboarding";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    CheckCircle2,
    Circle,
    Clock,
    ChevronRight,
    FileText,
    ShieldCheck,
    Monitor,
    GraduationCap
} from "lucide-react";
import StatusBadge from "@/components/candidate/StatusBadge";

export default function Onboarding() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOnboardingStatus().then(res => {
            setData(res);
            setLoading(false);
        });
    }, []);

    const getIcon = (category: string) => {
        switch (category) {
            case 'required': return FileText;
            case 'legal': return ShieldCheck;
            case 'it': return Monitor;
            case 'training': return GraduationCap;
            default: return Circle;
        }
    };

    return (
        <CandidateLayout>
            <div className="space-y-8 max-w-5xl">
                <header>
                    <h1 className="text-3xl font-bold text-[#2B2E33]">Onboarding</h1>
                    <p className="text-[#7B7F85] mt-1">Welcome to the team! Finish these tasks to get started.</p>
                </header>

                {loading ? (
                    <div className="h-96 rounded-2xl skeleton" />
                ) : (
                    <div className="space-y-8">
                        {/* Progress Card */}
                        <div className="bg-white border border-[#C1C4C8] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-12 shadow-soft">
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * data.completionPercentage) / 100} className="text-[#8017E1] transition-all duration-1000" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-[#2B2E33]">{data.completionPercentage}%</span>
                                    <span className="text-[10px] font-bold text-[#7B7F85] uppercase tracking-widest">Complete</span>
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-[#2B2E33] mb-2">Almost ready, Alex!</h2>
                                <p className="text-[#7B7F85] leading-relaxed mb-6">
                                    You've completed {data.tasks.filter((t: any) => t.status === 'completed').length} of {data.tasks.length} tasks.
                                    Finish the remaining items by April 12th to ensure a smooth first day.
                                </p>
                                <Button className="bg-[#8017E1] hover:bg-[#8017E1]/90 font-bold h-11 px-8">Continue Onboarding</Button>
                            </div>
                            <div className="hidden lg:block w-px h-32 bg-[#C1C4C8]/30" />
                            <div className="hidden lg:grid grid-cols-2 gap-8 text-center px-8">
                                <div>
                                    <p className="text-xs font-bold text-[#7B7F85] uppercase mb-1">Status</p>
                                    <StatusBadge status={data.status} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#7B7F85] uppercase mb-1">Days Left</p>
                                    <p className="text-xl font-bold text-[#2B2E33]">24</p>
                                </div>
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-[#2B2E33]">Tasks Checklist</h2>
                            <div className="grid gap-4">
                                {data.tasks.map((task: any) => {
                                    const Icon = getIcon(task.category);
                                    const isCompleted = task.status === 'completed';
                                    return (
                                        <div key={task.id} className={`bg-white border rounded-2xl p-5 flex items-center justify-between group transition-all ${isCompleted ? 'border-[#C1C4C8]/30 opacity-75' : 'border-[#C1C4C8] hover:border-[#8017E1] hover:shadow-soft'
                                            }`}>
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${isCompleted ? 'bg-[#5DA87A]/10 border-[#5DA87A]/20 text-[#5DA87A]' : 'bg-[#F5F6F7] border-[#C1C4C8] text-[#7B7F85] group-hover:text-[#8017E1] group-hover:border-[#8017E1]/30'
                                                    }`}>
                                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <p className={`font-bold transition-colors ${isCompleted ? 'text-[#7B7F85] line-through' : 'text-[#2B2E33] group-hover:text-[#8017E1]'}`}>
                                                        {task.title}
                                                    </p>
                                                    <p className="text-xs text-[#7B7F85] capitalize">{task.category} Documentation</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#7B7F85]">
                                                    <Clock className="w-3 h-3" />
                                                    5 mins
                                                </div>
                                                <Button variant="ghost" size="sm" className={`font-bold ${isCompleted ? 'text-[#5DA87A]' : 'text-[#8017E1]'}`}>
                                                    {isCompleted ? 'Completed' : 'Start Task'}
                                                    {!isCompleted && <ChevronRight className="w-4 h-4 ml-1" />}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CandidateLayout>
    );
}
