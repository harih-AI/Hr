import { useEffect, useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import CandidateLayout from "@/components/layout/CandidateLayout";
import { useJobStore } from "@/store/useJobStore";
import JobCard from "@/components/candidate/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function JobSearch() {
    const { jobs, fetchJobs, isLoading } = useJobStore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <CandidateLayout>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2B2E33]">Find Your Next Role</h1>
                        <p className="text-[#7B7F85] mt-1">AI-powered matching for your skills and preferences.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-10 border-[#C1C4C8]">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Preferences
                        </Button>
                    </div>
                </header>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B7F85]" />
                        <Input
                            placeholder="Search by role, company, or keywords..."
                            className="pl-10 h-12 bg-white border-[#C1C4C8] focus:border-[#8017E1]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button className="h-12 px-6 bg-[#8017E1] hover:bg-[#8017E1]/90 font-bold">
                        Search Jobs
                    </Button>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#2B2E33]">Recommended For You</h2>
                        <p className="text-sm text-[#7B7F85]">{filteredJobs.length} matches found</p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-64 rounded-xl skeleton" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredJobs.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CandidateLayout>
    );
}
