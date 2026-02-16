import { useEffect } from "react";
import CandidateLayout from "@/components/layout/CandidateLayout";
import { useOfferStore } from "@/store/useOfferStore";
import { Button } from "@/components/ui/button";
import {
    FileCheck,
    Download,
    ChevronRight,
    Wallet,
    Calendar,
    Rocket,
    ArrowRight,
    ShieldCheck,
    Zap
} from "lucide-react";
import StatusBadge from "@/components/candidate/StatusBadge";

export default function Offers() {
    const { offers, fetchOffers, isLoading } = useOfferStore();

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    return (
        <CandidateLayout>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-[#2B2E33]">Offers</h1>
                    <p className="text-[#7B7F85] mt-1">Review your compensation packages and next steps.</p>
                </header>

                {isLoading ? (
                    <div className="h-96 rounded-2xl skeleton" />
                ) : offers.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {offers.map((offer) => (
                                <div key={offer.id} className="bg-white border border-[#C1C4C8] rounded-3xl overflow-hidden shadow-soft">
                                    <div className="p-8 border-b border-[#C1C4C8] bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-white border border-[#C1C4C8] shadow-sm flex items-center justify-center font-bold text-2xl text-[#8017E1]">
                                                {offer.company[0]}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-[#2B2E33]">{offer.jobTitle}</h2>
                                                <p className="text-[#7B7F85] font-medium">{offer.company}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={offer.status} className="text-sm px-4 py-1" />
                                    </div>

                                    <div className="p-8 space-y-12">
                                        <section>
                                            <h3 className="text-lg font-bold text-[#2B2E33] mb-6 flex items-center gap-2">
                                                <Wallet className="w-5 h-5 text-[#8017E1]" />
                                                Compensation Breakdown
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="p-6 rounded-2xl bg-[#F5F6F7] border border-[#C1C4C8]/50">
                                                    <p className="text-xs font-bold text-[#7B7F85] uppercase tracking-widest mb-2">Base Salary</p>
                                                    <p className="text-2xl font-bold text-[#2B2E33]">{offer.details.baseSalary}</p>
                                                    <p className="text-xs text-[#7B7F85] mt-1">Annual (USD)</p>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-[#F5F6F7] border border-[#C1C4C8]/50">
                                                    <p className="text-xs font-bold text-[#7B7F85] uppercase tracking-widest mb-2">Bonus</p>
                                                    <p className="text-2xl font-bold text-[#2B2E33]">{offer.details.bonus}</p>
                                                    <p className="text-xs text-[#7B7F85] mt-1">Target Incentive</p>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-[#F5F6F7] border border-[#C1C4C8]/50">
                                                    <p className="text-xs font-bold text-[#7B7F85] uppercase tracking-widest mb-2">Equity</p>
                                                    <p className="text-2xl font-bold text-[#2B2E33]">{offer.details.equity}</p>
                                                    <p className="text-xs text-[#7B7F85] mt-1">Vesting Schedule</p>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-lg font-bold text-[#2B2E33] mb-6 flex items-center gap-2">
                                                <FileCheck className="w-5 h-5 text-[#8017E1]" />
                                                Offer Documents
                                            </h3>
                                            <div className="space-y-3">
                                                {offer.documents.map((doc: any) => (
                                                    <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-[#C1C4C8] hover:border-[#8017E1] transition-all group cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-[#8017E1]/5 text-[#8017E1]">
                                                                <Download className="w-4 h-4" />
                                                            </div>
                                                            <span className="font-semibold text-[#2B2E33]">{doc.name}</span>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-[#C1C4C8] group-hover:text-[#8017E1]" />
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                            <Button className="flex-1 h-14 bg-[#8017E1] hover:bg-[#8017E1]/90 text-lg font-bold rounded-2xl">
                                                Accept Offer
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </Button>
                                            <Button variant="outline" className="flex-1 h-14 border-[#C1C4C8] text-lg font-bold rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700">
                                                Decline
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-8">
                            <div className="bg-[#5DA87A] rounded-3xl p-8 text-white">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Why join {offers[0].company}?</h3>
                                <p className="text-white/90 leading-relaxed mb-8">
                                    Your role as {offers[0].jobTitle} will be pivotal in our next phase of growth. We offer a culture of speed, innovation, and radical transparency.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-sm">
                                        <ShieldCheck className="w-5 h-5 text-white/50 flex-shrink-0" />
                                        <span>Premium health & wellness coverage for you and your family.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm">
                                        <Calendar className="w-5 h-5 text-white/50 flex-shrink-0" />
                                        <span>Unlimited PTO with mandatory 2-week annual break.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm">
                                        <Rocket className="w-5 h-5 text-white/50 flex-shrink-0" />
                                        <span>$5,000 annual learning and development budget.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white border border-[#C1C4C8] rounded-3xl p-8">
                                <h3 className="font-bold text-[#2B2E33] mb-6">Offer Timeline</h3>
                                <div className="space-y-6">
                                    {offers[0].history.map((h: any, i: number) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 rounded-full bg-[#8017E1]" />
                                                {i < offers[0].history.length - 1 && <div className="w-0.5 h-10 bg-[#C1C4C8]/30 my-1" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#2B2E33]">{h.event}</p>
                                                <p className="text-xs text-[#7B7F85]">{h.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-[#C1C4C8] rounded-3xl p-16 text-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 rounded-full bg-gray-50 border border-[#C1C4C8] flex items-center justify-center mx-auto mb-6 text-[#C1C4C8]">
                            <FileCheck className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#2B2E33]">No Current Offers</h2>
                        <p className="text-[#7B7F85] mt-2">Active offers will appear here when you complete the interview process.</p>
                    </div>
                )}
            </div>
        </CandidateLayout>
    );
}
