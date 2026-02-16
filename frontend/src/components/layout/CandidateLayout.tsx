import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    User,
    Briefcase,
    FileText,
    Calendar,
    Gift,
    Rocket,
    LogOut,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

const navItems = [
    { label: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
    { label: "Job Search", href: "/candidate/jobs", icon: Briefcase },
    { label: "Applications", href: "/candidate/applications", icon: FileText },
    { label: "Interviews", href: "/candidate/interviews", icon: Calendar },
    { label: "Offers", href: "/candidate/offers", icon: Gift },
    { label: "Onboarding", href: "/candidate/onboarding", icon: Rocket },
    { label: "Profile", href: "/candidate/profile", icon: User },
];

export default function CandidateLayout({ children }: { children: ReactNode }) {
    const location = useLocation();
    const { logout, user } = useAuthStore();

    return (
        <div className="flex h-screen bg-[#F5F6F7]">
            {/* Sidebar - Optimized for Large Desktop */}
            <aside className="w-64 border-r border-[#C1C4C8] bg-white flex flex-col hidden md:flex">
                <div className="p-6 border-b border-[#C1C4C8]">
                    <Link to="/candidate/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#8017E1] flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-[#2B2E33]">NexusHR</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? "bg-[#8017E1]/10 text-[#8017E1]"
                                        : "text-[#7B7F85] hover:bg-gray-100 hover:text-[#2B2E33]"
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? "text-[#8017E1]" : "text-[#7B7F85]"}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#C1C4C8]">
                    <div className="flex items-center gap-3 p-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gray-200 border border-[#C1C4C8]" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#2B2E33] truncate">{user?.name || "Candidate"}</p>
                            <p className="text-xs text-[#7B7F85] truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={logout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 border-b border-[#C1C4C8] bg-white flex items-center justify-between px-6 md:hidden">
                    <Link to="/candidate/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#8017E1] flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                    </Link>
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-[1440px] mx-auto">
                        {children}
                    </div>
                </div>

                {/* Bottom Nav - Mobile Only */}
                <nav className="h-16 border-t border-[#C1C4C8] bg-white flex items-center justify-around md:hidden px-4">
                    {navItems.slice(0, 5).map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`flex flex-col items-center gap-1 ${isActive ? "text-[#8017E1]" : "text-[#7B7F85]"}`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </main>
        </div>
    );
}
