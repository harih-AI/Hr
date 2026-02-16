import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewService } from "@/services/interview";
import { useState } from "react";
import { CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CandidateDecision {
    candidateId: string;
    decision: 'approved' | 'rejected' | 'waitlist';
    reasoning: string;
}

export default function CandidateApproval() {
    const [decisions, setDecisions] = useState<Map<string, CandidateDecision>>(new Map());
    const [customReasons, setCustomReasons] = useState<Map<string, string>>(new Map());
    const queryClient = useQueryClient();

    const { data: results, isLoading } = useQuery({
        queryKey: ['interview-results'],
        queryFn: interviewService.getAll,
        refetchInterval: 30000,
    });

    const handleDecision = async (candidateId: string, decision: 'approved' | 'rejected' | 'waitlist', aiReasoning: string) => {
        const customReason = customReasons.get(candidateId);
        const finalReasoning = customReason || aiReasoning;

        try {
            // Save decision to backend
            await fetch('http://localhost:3000/api/interviews/decision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    candidateId,
                    decision,
                    reasoning: finalReasoning
                })
            });

            // Update local state
            setDecisions(new Map(decisions.set(candidateId, {
                candidateId,
                decision,
                reasoning: finalReasoning
            })));

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['interview-results'] });
        } catch (error) {
            console.error('Failed to save decision:', error);
            alert('Failed to save decision. Please try again.');
        }
    };

    const getAIRecommendation = (result: any) => {
        const score = result.evaluation.overallScore;
        const strengths = result.evaluation.strengths || [];
        const improvements = result.evaluation.improvements || [];

        if (score >= 85) {
            return {
                decision: 'approved' as const,
                reasoning: `Strong candidate with ${score}% overall score. Key strengths: ${strengths.slice(0, 2).join(', ')}. Recommended for immediate hire.`
            };
        } else if (score >= 70) {
            return {
                decision: 'waitlist' as const,
                reasoning: `Moderate candidate with ${score}% overall score. Shows potential in: ${strengths.slice(0, 2).join(', ')}. Consider for waitlist or further evaluation. Areas to develop: ${improvements.slice(0, 2).join(', ')}.`
            };
        } else {
            return {
                decision: 'rejected' as const,
                reasoning: `Below threshold with ${score}% overall score. Significant gaps in: ${improvements.slice(0, 3).join(', ')}. Not recommended at this time.`
            };
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Candidate Approval</h1>
                        <p className="text-muted-foreground mt-1">Review and approve candidates based on AI interview results</p>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <Skeleton className="h-6 w-48 mb-4" />
                                    <Skeleton className="h-24 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const pendingResults = results?.filter(r => !decisions.has(r.candidateId)) || [];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Candidate Approval</h1>
                    <p className="text-muted-foreground mt-1">
                        Review {pendingResults.length} candidate{pendingResults.length !== 1 ? 's' : ''} awaiting decision
                    </p>
                </div>

                {pendingResults.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                            <p className="text-muted-foreground">No candidates pending approval at the moment.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {pendingResults.map((result) => {
                            const aiRec = getAIRecommendation(result);
                            const currentDecision = decisions.get(result.candidateId);

                            return (
                                <Card key={result.candidateId} className="border-2">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-xl">{result.candidateName}</CardTitle>
                                                <CardDescription>{result.candidateEmail}</CardDescription>
                                            </div>
                                            <Badge variant={result.status === 'Passed' ? 'default' : 'secondary'}>
                                                {result.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Score Overview */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center p-4 bg-primary/5 rounded-lg">
                                                <div className="text-3xl font-bold text-primary">
                                                    {result.evaluation.overallScore}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">Overall Score</div>
                                            </div>
                                            <div className="text-center p-4 bg-secondary/5 rounded-lg">
                                                <div className="text-3xl font-bold">
                                                    {result.evaluation.technicalScore}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">Technical</div>
                                            </div>
                                            <div className="text-center p-4 bg-accent/5 rounded-lg">
                                                <div className="text-3xl font-bold">
                                                    {result.evaluation.communicationScore}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">Communication</div>
                                            </div>
                                        </div>

                                        {/* Strengths & Improvements */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {result.evaluation.strengths.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                                        <span className="font-medium text-sm">Strengths</span>
                                                    </div>
                                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                                        {result.evaluation.strengths.map((s: string, i: number) => (
                                                            <li key={i}>• {s}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {result.evaluation.improvements.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingDown className="w-4 h-4 text-orange-600" />
                                                        <span className="font-medium text-sm">Areas for Improvement</span>
                                                    </div>
                                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                                        {result.evaluation.improvements.map((i: string, idx: number) => (
                                                            <li key={idx}>• {i}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* AI Recommendation */}
                                        <div className="bg-accent/30 p-4 rounded-lg border border-accent">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-xs font-bold">AI</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm mb-1">AI Recommendation:
                                                        <Badge className="ml-2" variant={
                                                            aiRec.decision === 'approved' ? 'default' :
                                                                aiRec.decision === 'waitlist' ? 'secondary' : 'destructive'
                                                        }>
                                                            {aiRec.decision.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{aiRec.reasoning}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Custom Reasoning */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Custom Reasoning (Optional)</label>
                                            <Textarea
                                                placeholder="Add your own reasoning or notes..."
                                                value={customReasons.get(result.candidateId) || ''}
                                                onChange={(e) => {
                                                    const newReasons = new Map(customReasons);
                                                    newReasons.set(result.candidateId, e.target.value);
                                                    setCustomReasons(newReasons);
                                                }}
                                                className="min-h-[80px]"
                                            />
                                        </div>

                                        {/* Decision Buttons */}
                                        <div className="flex gap-3 pt-2">
                                            <Button
                                                onClick={() => handleDecision(result.candidateId, 'approved', aiRec.reasoning)}
                                                className="flex-1"
                                                variant="default"
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() => handleDecision(result.candidateId, 'waitlist', aiRec.reasoning)}
                                                className="flex-1"
                                                variant="secondary"
                                            >
                                                <Clock className="w-4 h-4 mr-2" />
                                                Waitlist
                                            </Button>
                                            <Button
                                                onClick={() => handleDecision(result.candidateId, 'rejected', aiRec.reasoning)}
                                                className="flex-1"
                                                variant="destructive"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Reject
                                            </Button>
                                        </div>

                                        {/* Confirmation Message */}
                                        {currentDecision && (
                                            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                    <span className="font-medium text-sm text-green-900 dark:text-green-100">
                                                        Decision Recorded: {currentDecision.decision.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-green-700 dark:text-green-300">
                                                    {currentDecision.reasoning}
                                                </p>
                                            </div>
                                        )}

                                        {/* Interview Details */}
                                        <div className="text-xs text-muted-foreground pt-4 border-t">
                                            Completed {new Date(result.completedAt).toLocaleString()} • {result.totalQuestions} questions answered
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
