import { MapPin, DollarSign, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";

interface JobCardProps {
    job: {
        id: string;
        title: string;
        company: string;
        location: string;
        salary: string;
        type: string;
        postedAt: string;
        aiMatchScore: number;
        aiMatchReasoning: string;
    };
}

export default function JobCard({ job }: JobCardProps) {
    return (
        <div className="bg-white border border-[#C1C4C8] rounded-xl p-6 transition-all hover:shadow-soft hover:border-[#8017E1]/50 group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-[#2B2E33] group-hover:text-[#8017E1] transition-colors">{job.title}</h3>
                    <p className="text-[#7B7F85] font-medium">{job.company}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#8017E1]/5 border border-[#8017E1]/10">
                    <Sparkles className="w-4 h-4 text-[#8017E1]" />
                    <span className="text-sm font-bold text-[#8017E1]">{job.aiMatchScore}% Match</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#7B7F85]">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#7B7F85]">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#7B7F85]">
                    <Clock className="w-4 h-4" />
                    {job.type}
                </div>
            </div>

            <div className="bg-[#F5F6F7] rounded-lg p-3 mb-6 border border-[#C1C4C8]/50">
                <p className="text-xs font-semibold text-[#7B7F85] uppercase tracking-wider mb-1">AI Recommendation</p>
                <p className="text-sm text-[#2B2E33] line-clamp-2">{job.aiMatchReasoning}</p>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-[#7B7F85]">Applied 12h ago</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9">Save</Button>
                    <Button size="sm" className="bg-[#8017E1] hover:bg-[#8017E1]/90 h-9">Apply Now</Button>
                </div>
            </div>
        </div>
    );
}
