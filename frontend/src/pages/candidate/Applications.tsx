import { useEffect } from "react";
import CandidateLayout from "@/components/layout/CandidateLayout";
import { useApplicationStore } from "@/store/useApplicationStore";
import StatusBadge from "@/components/candidate/StatusBadge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronRight, FileText } from "lucide-react";

export default function Applications() {
    const { applications, fetchApplications, isLoading } = useApplicationStore();

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return (
        <CandidateLayout>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-[#2B2E33]">My Applications</h1>
                    <p className="text-[#7B7F85] mt-1">Track your progress and screening results.</p>
                </header>

                <div className="bg-white border border-[#C1C4C8] rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#F5F6F7] border-b border-[#C1C4C8]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-[#7B7F85] uppercase tracking-wider">Role & Company</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#7B7F85] uppercase tracking-wider">Applied Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#7B7F85] uppercase tracking-wider">Current Stage</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#7B7F85] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-[#7B7F85] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#C1C4C8]">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i}><td colSpan={5} className="p-6 skeleton h-16"></td></tr>
                                ))
                            ) : (
                                applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#8017E1]/5 border border-[#8017E1]/10 flex items-center justify-center font-bold text-[#8017E1]">
                                                    {app.company[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#2B2E33] group-hover:text-[#8017E1] transition-colors">{app.jobTitle}</p>
                                                    <p className="text-sm text-[#7B7F85]">{app.company}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-sm text-[#2B2E33]">
                                            {new Date(app.appliedDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-6 text-sm text-[#2B2E33] font-medium">
                                            {app.currentStage}
                                        </td>
                                        <td className="px-6 py-6">
                                            <StatusBadge status={app.status} />
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" className="font-bold text-[#8017E1]">Details</Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7B7F85]"><MoreHorizontal className="w-4 h-4" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Timeline Visualization for the first application */}
                {applications.length > 0 && (
                    <div className="bg-white border border-[#C1C4C8] rounded-xl p-8">
                        <h2 className="text-xl font-bold text-[#2B2E33] mb-8">Process Timeline: {applications[0].jobTitle}</h2>
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#C1C4C8]/50" />
                            <div className="space-y-10">
                                {applications[0].timeline.map((step: any, idx: number) => (
                                    <div key={idx} className="relative pl-12">
                                        <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 ${step.status === 'completed' ? 'bg-[#5DA87A] border-[#5DA87A] text-white' :
                                                step.status === 'current' ? 'bg-white border-[#8017E1] text-[#8017E1]' : 'bg-white border-[#C1C4C8] text-[#C1C4C8]'
                                            }`}>
                                            {step.status === 'completed' ? <FileText className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                        </div>
                                        <div>
                                            <p className={`font-bold ${step.status === 'current' ? 'text-[#8017E1]' : 'text-[#2B2E33]'}`}>{step.stage}</p>
                                            <p className="text-sm text-[#7B7F85]">{step.date}</p>
                                            {step.score && (
                                                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#5DA87A]/10 text-[#2E6B46] text-xs font-bold">
                                                    AI Screening Score: {step.score}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CandidateLayout>
    );
}
