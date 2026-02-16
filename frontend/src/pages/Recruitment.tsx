import { AppSidebar } from "@/components/layout/AppSidebar";
import { Sparkles, Users, UserPlus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Recruitment = () => {
    return (
        <div className="flex min-h-screen bg-background">
            <AppSidebar />
            <main className="flex-1 lg:pl-64">
                <div className="container-wide section-padding py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-verified mb-2">
                                <UserPlus className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Recruitment</span>
                            </div>
                            <h1 className="text-3xl font-bold text-foreground">Talent Acquisition</h1>
                            <p className="text-muted-foreground mt-1">Manage your hiring pipeline and AI-powered candidate screening.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline">Export Data</Button>
                            <Button className="bg-verified hover:bg-verified/90">
                                <UserPlus className="w-4 h-4 mr-2" />
                                New Job Opening
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="card-elevated p-6">
                            <p className="text-sm text-muted-foreground">Active Openings</p>
                            <h2 className="text-3xl font-bold mt-2">12</h2>
                            <div className="flex items-center gap-2 mt-4 text-xs text-success bg-success/10 w-fit px-2 py-1 rounded-full">
                                <Sparkles className="w-3 h-3" />
                                <span>2 new this week</span>
                            </div>
                        </div>
                        <div className="card-elevated p-6">
                            <p className="text-sm text-muted-foreground">Total Candidates</p>
                            <h2 className="text-3xl font-bold mt-2">847</h2>
                            <p className="text-xs text-muted-foreground mt-4">Screened by AI</p>
                        </div>
                        <div className="card-elevated p-6">
                            <p className="text-sm text-muted-foreground">Interview Scheduled</p>
                            <h2 className="text-3xl font-bold mt-2">24</h2>
                            <p className="text-xs text-muted-foreground mt-4">Next 48 hours</p>
                        </div>
                    </div>

                    <div className="card-elevated">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="font-semibold">Recent Applications</h3>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search candidates..."
                                        className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-verified/50 w-64"
                                    />
                                </div>
                                <Button variant="outline" size="sm">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                        </div>
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">Candidate list is empty</h3>
                            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                                No applications match your current filters. Try adjusting your search or check again later.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Recruitment;
