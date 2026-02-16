import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const getStyles = (s: string) => {
        switch (s.toLowerCase()) {
            case 'active':
            case 'hired':
            case 'completed':
            case 'accepted':
                return 'bg-[#5DA87A]/10 text-[#2E6B46] border-[#5DA87A]/20';
            case 'pending':
            case 'review':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'interviewing':
            case 'in progress':
                return 'bg-[#8017E1]/10 text-[#8017E1] border-[#8017E1]/20';
            case 'rejected':
            case 'closed':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
            getStyles(status),
            className
        )}>
            {status}
        </span>
    );
}
