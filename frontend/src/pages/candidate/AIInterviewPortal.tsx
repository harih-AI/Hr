import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Camera, Mic, MicOff, Video, VideoOff, Clock, Send, Bot, AlertTriangle, Shield, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    startInterviewSession,
    submitAnswer,
    getInterviewEvaluation,
    type InterviewQuestion,
    type InterviewSession
} from "@/services/aiInterview";
import { useProfileStore } from "@/store/useProfileStore";
import { cn } from "@/lib/utils";

export default function AIInterviewPortal() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { profile } = useProfileStore();

    const [session, setSession] = useState<InterviewSession | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    // Proctoring states
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [violations, setViolations] = useState<string[]>([]);
    const [hasStarted, setHasStarted] = useState(false);
    const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fullscreenRef = useRef<HTMLDivElement>(null);

    const jobId = searchParams.get("jobId") || "job_01";

    // Check if interview was already attempted
    useEffect(() => {
        const attemptKey = `interview_attempted_${profile?.id}_${jobId}`;
        const hasAttempted = localStorage.getItem(attemptKey);

        if (hasAttempted === 'true') {
            alert('You have already attempted this interview. Multiple attempts are not allowed.');
            navigate('/candidate/dashboard');
        }
    }, [profile?.id, jobId, navigate]);

    // Tab visibility detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && hasStarted) {
                const newCount = tabSwitchCount + 1;
                setTabSwitchCount(newCount);
                const violation = `Tab switched/minimized at ${new Date().toLocaleTimeString()} (Count: ${newCount})`;
                setViolations(prev => [...prev, violation]);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [hasStarted, tabSwitchCount]);

    // Prevent right-click and keyboard shortcuts
    useEffect(() => {
        const preventContextMenu = (e: MouseEvent) => {
            if (hasStarted) {
                e.preventDefault();
            }
        };

        const preventKeyboardShortcuts = (e: KeyboardEvent) => {
            if (hasStarted) {
                // Prevent F11, Ctrl+Shift+I, Ctrl+U, etc.
                if (
                    e.key === 'F11' ||
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'u')
                ) {
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('contextmenu', preventContextMenu);
        document.addEventListener('keydown', preventKeyboardShortcuts);

        return () => {
            document.removeEventListener('contextmenu', preventContextMenu);
            document.removeEventListener('keydown', preventKeyboardShortcuts);
        };
    }, [hasStarted]);

    useEffect(() => {
        return () => {
            stopCamera();
            exitFullscreen();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (hasStarted) {
            timerRef.current = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [currentQuestionIndex, hasStarted]);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: true
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                mediaStreamRef.current = stream;
            }

            setIsCameraOn(true);
            setCameraPermissionGranted(true);
            return true;
        } catch (error) {
            console.error("Camera permission denied:", error);
            alert("Camera access is required to start the interview. Please grant camera permissions.");
            return false;
        }
    };

    const enterFullscreen = async () => {
        try {
            const elem = fullscreenRef.current;
            if (elem) {
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if ((elem as any).webkitRequestFullscreen) {
                    await (elem as any).webkitRequestFullscreen();
                } else if ((elem as any).mozRequestFullScreen) {
                    await (elem as any).mozRequestFullScreen();
                } else if ((elem as any).msRequestFullscreen) {
                    await (elem as any).msRequestFullscreen();
                }
            }
        } catch (error) {
            console.error("Failed to enter fullscreen:", error);
        }
    };

    const exitFullscreen = () => {
        try {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
                (document as any).mozCancelFullScreen();
            } else if ((document as any).msExitFullscreen) {
                (document as any).msExitFullscreen();
            }
        } catch (error) {
            console.error("Failed to exit fullscreen:", error);
        }
    };

    const startInterview = async () => {
        setIsStarting(true);

        // Request camera permission
        const cameraGranted = await requestCameraPermission();
        if (!cameraGranted) {
            setIsStarting(false);
            return;
        }

        // Initialize interview (fullscreen will be entered when user submits first answer)
        try {
            setErrorMsg(null);
            const richResume = `
                CANDIDATE: ${profile?.firstName} ${profile?.lastName}
                HEADLINE: ${profile?.headline}
                SUMMARY: ${profile?.summary}
                SKILLS: ${profile?.skills?.technical?.join(', ') || 'React, Node.js, TypeScript'}
                EXPERIENCE: ${profile?.experience?.map(e => `${e.role} at ${e.company} (${e.duration}). Responsibilities: ${e.responsibilities?.join(', ') || 'Various technical tasks'}`).join('; ') || 'See skills'}
                PROJECTS: ${profile?.projects?.map(p => `${p.name}: ${p.description}. Tech: ${p.technologies?.join(', ')}`).join('; ') || 'N/A'}
            `;

            const sessionData = await startInterviewSession({
                candidateId: profile?.id || "cand_001",
                jobId: jobId,
                resumeText: richResume,
                candidateProfile: profile,
                experienceYears: profile?.totalYearsOfExperience || 4,
                primarySkills: profile?.skills?.technical || ['React', 'Node.js', 'AI']
            });

            setSession(sessionData);
            setHasStarted(true);
            setIsStarting(false);
            // Fullscreen will be entered when user clicks submit on first question
        } catch (error: any) {
            console.error("Failed to initialize interview:", error);
            setErrorMsg(error?.response?.data?.error || error.message || "Unknown connection error");
            setIsStarting(false);
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim() || !session) return;

        setIsSubmitting(true);
        try {
            const currentQuestion = session.questions[currentQuestionIndex];
            const result = await submitAnswer({
                sessionId: session.sessionId,
                questionId: currentQuestion.id,
                answer: answer.trim(),
                responseTime: timeElapsed
            });

            if (result.isComplete) {
                // Mark interview as attempted
                const attemptKey = `interview_attempted_${profile?.id}_${jobId}`;
                localStorage.setItem(attemptKey, 'true');

                // Store violations for review
                if (violations.length > 0) {
                    localStorage.setItem(`interview_violations_${session.sessionId}`, JSON.stringify(violations));
                }

                stopCamera();
                navigate(`/candidate/interview-results?sessionId=${session.sessionId}`);
            } else {
                setCurrentQuestionIndex(prev => prev + 1);
                setAnswer("");
                setTimeElapsed(0);
            }
        } catch (error) {
            console.error("Failed to submit answer:", error);
            alert("Failed to submit answer. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-card border border-border rounded-xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
                        <h1 className="text-3xl font-bold mb-2">AI Interview - Proctored</h1>
                        <p className="text-muted-foreground">Please read the instructions carefully before starting</p>
                    </div>

                    <Alert className="mb-6 border-orange-500/50 bg-orange-500/10">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <AlertDescription className="text-sm">
                            <strong>Important:</strong> This is a one-time interview. You cannot retake it once started.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4 mb-8">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary" />
                            Proctoring Requirements:
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                            <li>✓ Camera must be ON throughout the interview</li>
                            <li>✓ Tab switching is NOT allowed and will be tracked</li>
                            <li>✓ Stay focused on the interview window</li>
                            <li>✓ All violations will be reported to HR</li>
                        </ul>
                    </div>

                    <div className="bg-accent/30 p-4 rounded-lg mb-6">
                        <h4 className="font-medium mb-2">What to expect:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• You will be asked {session?.totalQuestions || 8} questions</li>
                            <li>• Answer each question in the text area provided</li>
                            <li>• Your camera feed will be visible to you</li>
                            <li>• Take your time to provide thoughtful answers</li>
                        </ul>
                    </div>

                    <Button
                        onClick={startInterview}
                        className="w-full h-12 text-lg"
                        disabled={isStarting}
                    >
                        {isStarting ? "Starting Interview..." : "I Understand - Start Interview"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                        By clicking start, you agree to the proctoring requirements
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading || !session) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Initializing interview...</p>
                </div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Alert className="max-w-md border-destructive/50 bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertDescription>
                        <strong>Error:</strong> {errorMsg}
                        <Button onClick={() => navigate('/candidate/dashboard')} className="mt-4 w-full">
                            Return to Dashboard
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const currentQuestion = session.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / session.totalQuestions) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
                {/* Header */}
                <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold">AI Interview</h1>
                                <p className="text-sm text-muted-foreground">
                                    Question {currentQuestionIndex + 1} of {session.totalQuestions}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="font-mono">{formatTime(timeElapsed)}</span>
                            </div>

                            {violations.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-destructive">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>{violations.length} violation(s)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Video Feed */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border rounded-xl p-4 shadow-lg sticky top-6">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                Camera Feed
                            </h3>
                            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                                {!isCameraOn && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                        <VideoOff className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 flex gap-2">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        isCameraOn ? "bg-green-500" : "bg-destructive"
                                    )}>
                                        {isCameraOn ? <Video className="w-4 h-4 text-white" /> : <VideoOff className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Question & Answer */}
                    <div className="lg:col-span-2">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                            <div className="mb-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground mb-2">Question {currentQuestionIndex + 1}</p>
                                        <p className="text-lg font-medium leading-relaxed">{currentQuestion.question}</p>
                                        {currentQuestion.category && (
                                            <span className="inline-block mt-3 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                {currentQuestion.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium">Your Answer</label>
                                <Textarea
                                    key={currentQuestionIndex}
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="min-h-[200px] resize-none"
                                    disabled={isSubmitting}
                                    autoFocus
                                    tabIndex={0}
                                />

                                <div className="flex items-center justify-between pt-4">
                                    <p className="text-sm text-muted-foreground">
                                        {answer.length} characters
                                    </p>
                                    <Button
                                        onClick={handleSubmitAnswer}
                                        disabled={!answer.trim() || isSubmitting}
                                        size="lg"
                                        className="min-w-[140px]"
                                    >
                                        {isSubmitting ? (
                                            "Submitting..."
                                        ) : currentQuestionIndex === session.totalQuestions - 1 ? (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Finish Interview
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Next Question
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
