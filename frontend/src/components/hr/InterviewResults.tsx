import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";

interface InterviewResult {
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    evaluation: {
        overallScore: number;
        technicalScore: number;
        communicationScore: number;
        confidenceScore: number;
        strengths: string[];
        improvements: string[];
        recommendation: string;
    };
    totalQuestions: number;
    completedAt: string;
    status: 'Passed' | 'Needs Review';
}

interface InterviewResultsProps {
    results: InterviewResult[];
}

export function InterviewResults({ results }: InterviewResultsProps) {
    if (!results || results.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Interview Results</CardTitle>
                    <CardDescription>No completed interviews yet</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Interview results will appear here once candidates complete their AI interviews.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Interview Results</CardTitle>
                <CardDescription>
                    {results.length} candidate{results.length !== 1 ? 's' : ''} evaluated
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {results.map((result) => (
                        <div
                            key={result.candidateId}
                            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold text-sm">{result.candidateName}</h4>
                                    <p className="text-xs text-muted-foreground">{result.candidateEmail}</p>
                                </div>
                                <Badge variant={result.status === 'Passed' ? 'default' : 'secondary'}>
                                    {result.status === 'Passed' ? (
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                    ) : (
                                        <Clock className="w-3 h-3 mr-1" />
                                    )}
                                    {result.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <div className="text-center p-2 bg-primary/5 rounded">
                                    <div className="text-2xl font-bold text-primary">
                                        {result.evaluation.overallScore}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Overall</div>
                                </div>
                                <div className="text-center p-2 bg-secondary/5 rounded">
                                    <div className="text-2xl font-bold">
                                        {result.evaluation.technicalScore}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Technical</div>
                                </div>
                                <div className="text-center p-2 bg-accent/5 rounded">
                                    <div className="text-2xl font-bold">
                                        {result.evaluation.communicationScore}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Communication</div>
                                </div>
                            </div>

                            {result.evaluation.strengths.length > 0 && (
                                <div className="mb-2">
                                    <div className="flex items-center gap-1 mb-1">
                                        <TrendingUp className="w-3 h-3 text-green-600" />
                                        <span className="text-xs font-medium">Strengths:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {result.evaluation.strengths.slice(0, 3).map((strength, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                                {strength}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {result.evaluation.improvements.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <TrendingDown className="w-3 h-3 text-orange-600" />
                                        <span className="text-xs font-medium">Areas for Improvement:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {result.evaluation.improvements.slice(0, 3).map((improvement, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                {improvement}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                                Completed {new Date(result.completedAt).toLocaleString()} • {result.totalQuestions} questions
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
