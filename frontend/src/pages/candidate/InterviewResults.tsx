import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Trophy, TrendingUp, MessageSquare, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CandidateLayout from "@/components/layout/CandidateLayout";
import { getInterviewEvaluation, type InterviewEvaluation } from "@/services/aiInterview";

export default function InterviewResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const sessionId = searchParams.get("sessionId");

    useEffect(() => {
        if (sessionId) {
            loadEvaluation();
        }
    }, [sessionId]);

    const loadEvaluation = async () => {
        try {
            const data = await getInterviewEvaluation(sessionId!);
            setEvaluation(data);
        } catch (error) {
            console.error("Failed to load evaluation:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <CandidateLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[#8017E1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[#7B7F85] font-medium">Analyzing your interview...</p>
                    </div>
                </div>
            </CandidateLayout>
        );
    }

    if (!evaluation) {
        return (
            <CandidateLayout>
                <div className="text-center py-12">
                    <p className="text-[#2B2E33] font-bold text-xl mb-4">Evaluation not found</p>
                    <Button onClick={() => navigate("/candidate/interviews")}>Back to Interviews</Button>
                </div>
            </CandidateLayout>
        );
    }

    return (
        <CandidateLayout>
            <div className="space-y-8 max-w-5xl">
                {/* Header */}
                <header className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8017E1] to-[#A855F7] flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#2B2E33] mb-2">Interview Complete!</h1>
                    <p className="text-[#7B7F85]">Here's your AI-powered performance analysis</p>
                </header>

                {/* Overall Score */}
                <div className="bg-gradient-to-br from-[#8017E1] to-[#A855F7] rounded-3xl p-8 text-white text-center">
                    <p className="text-sm font-bold uppercase tracking-wider opacity-90 mb-2">Overall Score</p>
                    <div className="text-6xl font-bold mb-2">{evaluation.overallScore}</div>
                    <p className="text-lg opacity-90">{evaluation.recommendation}</p>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-[#C1C4C8] rounded-2xl p-6 text-center">
                        <p className="text-xs font-bold text-[#7B7F85] uppercase mb-2">Technical</p>
                        <div className="text-3xl font-bold text-[#2B2E33] mb-1">{evaluation.technicalScore}</div>
                        <div className="w-full bg-[#F5F6F7] rounded-full h-2">
                            <div
                                className="bg-[#8017E1] h-2 rounded-full transition-all"
                                style={{ width: `${evaluation.technicalScore}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-[#C1C4C8] rounded-2xl p-6 text-center">
                        <p className="text-xs font-bold text-[#7B7F85] uppercase mb-2">Communication</p>
                        <div className="text-3xl font-bold text-[#2B2E33] mb-1">{evaluation.communicationScore}</div>
                        <div className="w-full bg-[#F5F6F7] rounded-full h-2">
                            <div
                                className="bg-[#5DA87A] h-2 rounded-full transition-all"
                                style={{ width: `${evaluation.communicationScore}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-[#C1C4C8] rounded-2xl p-6 text-center">
                        <p className="text-xs font-bold text-[#7B7F85] uppercase mb-2">Confidence</p>
                        <div className="text-3xl font-bold text-[#2B2E33] mb-1">{evaluation.confidenceScore}</div>
                        <div className="w-full bg-[#F5F6F7] rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${evaluation.confidenceScore}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#C1C4C8] rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#5DA87A]/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-[#5DA87A]" />
                            </div>
                            <h2 className="text-lg font-bold text-[#2B2E33]">Strengths</h2>
                        </div>
                        <ul className="space-y-3">
                            {evaluation.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#5DA87A] mt-2" />
                                    <span className="text-[#2B2E33]">{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white border border-[#C1C4C8] rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#8017E1]/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-[#8017E1]" />
                            </div>
                            <h2 className="text-lg font-bold text-[#2B2E33]">Areas to Improve</h2>
                        </div>
                        <ul className="space-y-3">
                            {evaluation.improvements.map((improvement, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#8017E1] mt-2" />
                                    <span className="text-[#2B2E33]">{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Detailed Feedback */}
                <div className="bg-white border border-[#C1C4C8] rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#8017E1]/10 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-[#8017E1]" />
                        </div>
                        <h2 className="text-lg font-bold text-[#2B2E33]">Detailed Feedback</h2>
                    </div>
                    <p className="text-[#2B2E33] leading-relaxed">{evaluation.detailedFeedback}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/candidate/interviews")}
                        className="border-[#C1C4C8] font-bold"
                    >
                        Back to Interviews
                    </Button>
                    <Button
                        onClick={() => navigate("/candidate/dashboard")}
                        className="bg-[#8017E1] hover:bg-[#8017E1]/90 font-bold"
                    >
                        Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </CandidateLayout>
    );
}
