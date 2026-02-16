import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Bot, Send, Briefcase, Users, CheckCircle2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobPost {
    id: string;
    title: string;
    department: string;
    description: string;
    skills: string[];
    experience: string;
    location: string;
    salary?: string;
    employmentType: string;
    status: 'Open' | 'Closed';
    applicants: number;
    createdAt: string;
}

interface ChatMessage {
    role: 'agent' | 'user';
    content: string;
}

const QUESTIONS = [
    { field: 'title', question: 'What is the Job Role / Title?' },
    { field: 'department', question: 'Which Department is this position for?' },
    { field: 'description', question: 'Please provide the Job Description:' },
    { field: 'skills', question: 'What are the Required Skills? (comma-separated)' },
    { field: 'experience', question: 'What Experience is Required? (e.g., "2-4 years")' },
    { field: 'location', question: 'What is the Location? (Remote / Hybrid / Onsite)' },
    { field: 'salary', question: 'What is the Salary Range? (optional, press Enter to skip)' },
    { field: 'employmentType', question: 'What is the Employment Type? (Full-time / Part-time / Internship / Contract)' }
];

export default function JobPosting() {
    const [jobs, setJobs] = useState<JobPost[]>([
        {
            id: 'job_01',
            title: 'Senior Full Stack Developer',
            department: 'Engineering',
            description: 'We are looking for an experienced Full Stack Developer to join our team...',
            skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
            experience: '3-5 years',
            location: 'Hybrid',
            salary: '$80,000 - $120,000',
            employmentType: 'Full-time',
            status: 'Open',
            applicants: 12,
            createdAt: new Date().toISOString()
        }
    ]);

    const [showAgent, setShowAgent] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [jobData, setJobData] = useState<Partial<JobPost>>({});
    const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

    const startConversation = () => {
        setShowAgent(true);
        setMessages([{
            role: 'agent',
            content: 'Hello! I\'m your HR Job Posting Agent. I\'ll help you create a new job vacancy. Let\'s get started!\n\n' + QUESTIONS[0].question
        }]);
        setCurrentStep(0);
        setJobData({});
    };

    const handleSendMessage = () => {
        if (!userInput.trim()) return;

        // Add user message
        const newMessages = [...messages, { role: 'user' as const, content: userInput }];
        setMessages(newMessages);

        // Save the answer
        const currentQuestion = QUESTIONS[currentStep];
        const updatedJobData = { ...jobData };

        if (currentQuestion.field === 'skills') {
            updatedJobData.skills = userInput.split(',').map(s => s.trim());
        } else {
            (updatedJobData as any)[currentQuestion.field] = userInput;
        }

        setJobData(updatedJobData);
        setUserInput('');

        // Move to next question or finish
        if (currentStep < QUESTIONS.length - 1) {
            setTimeout(() => {
                setMessages([...newMessages, {
                    role: 'agent',
                    content: 'Got it! ' + QUESTIONS[currentStep + 1].question
                }]);
                setCurrentStep(currentStep + 1);
            }, 500);
        } else {
            // All questions answered - show preview
            setTimeout(() => {
                const preview = `
Perfect! Here's the job posting I've created:

📋 **Job Title:** ${updatedJobData.title}
🏢 **Department:** ${updatedJobData.department}
📝 **Description:** ${updatedJobData.description}
💼 **Required Skills:** ${(updatedJobData.skills as string[])?.join(', ')}
⏱️ **Experience:** ${updatedJobData.experience}
📍 **Location:** ${updatedJobData.location}
💰 **Salary:** ${updatedJobData.salary || 'Not specified'}
📊 **Employment Type:** ${updatedJobData.employmentType}

Would you like to publish this job posting? Type "yes" to confirm or "no" to cancel.
                `.trim();

                setMessages([...newMessages, {
                    role: 'agent',
                    content: preview
                }]);
                setCurrentStep(currentStep + 1); // Move to confirmation step
            }, 500);
        }
    };

    const handleConfirmation = (confirm: boolean) => {
        if (confirm) {
            const newJob: JobPost = {
                id: `job_${Date.now()}`,
                title: jobData.title || '',
                department: jobData.department || '',
                description: jobData.description || '',
                skills: jobData.skills || [],
                experience: jobData.experience || '',
                location: jobData.location || '',
                salary: jobData.salary,
                employmentType: jobData.employmentType || '',
                status: 'Open',
                applicants: 0,
                createdAt: new Date().toISOString()
            };

            setJobs([newJob, ...jobs]);
            setMessages([...messages, {
                role: 'agent',
                content: '✅ Job posting published successfully! You can now close this chat and see it in the job list.'
            }]);

            setTimeout(() => {
                setShowAgent(false);
                setMessages([]);
                setCurrentStep(0);
                setJobData({});
            }, 2000);
        } else {
            setMessages([...messages, {
                role: 'agent',
                content: 'Job posting cancelled. Feel free to start over anytime!'
            }]);
            setTimeout(() => {
                setShowAgent(false);
                setMessages([]);
                setCurrentStep(0);
                setJobData({});
            }, 1500);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <Briefcase className="w-6 h-6 text-primary" />
                            Job Postings
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage job vacancies and track applications
                        </p>
                    </div>
                    <Button onClick={startConversation} disabled={showAgent}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Job
                    </Button>
                </div>

                {/* Job Posting Agent Chat */}
                {showAgent && (
                    <Card className="border-2 border-primary/50">
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="w-5 h-5 text-primary" />
                                Job Posting Agent
                            </CardTitle>
                            <CardDescription>
                                I'll guide you through creating a new job posting
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Chat Messages */}
                            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex gap-3",
                                            msg.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {msg.role === 'agent' && (
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-4 h-4 text-primary" />
                                            </div>
                                        )}
                                        <div
                                            className={cn(
                                                "max-w-[80%] rounded-lg p-3 whitespace-pre-wrap",
                                                msg.role === 'agent'
                                                    ? "bg-accent text-foreground"
                                                    : "bg-primary text-primary-foreground"
                                            )}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            {currentStep < QUESTIONS.length && (
                                <div className="p-4 border-t">
                                    <div className="flex gap-2">
                                        <Input
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type your answer..."
                                            className="flex-1"
                                        />
                                        <Button onClick={handleSendMessage} disabled={!userInput.trim()}>
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Confirmation Buttons */}
                            {currentStep === QUESTIONS.length && messages[messages.length - 1]?.content.includes('confirm') && (
                                <div className="p-4 border-t flex gap-3">
                                    <Button onClick={() => handleConfirmation(true)} className="flex-1">
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Yes, Publish
                                    </Button>
                                    <Button onClick={() => handleConfirmation(false)} variant="outline" className="flex-1">
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Job List */}
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold">{job.title}</h3>
                                            <Badge variant={job.status === 'Open' ? 'default' : 'secondary'}>
                                                {job.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{job.department}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        {job.applicants} Applicants
                                    </Button>
                                </div>

                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {job.description}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Experience:</span>
                                        <p className="font-medium">{job.experience}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Location:</span>
                                        <p className="font-medium">{job.location}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Type:</span>
                                        <p className="font-medium">{job.employmentType}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Salary:</span>
                                        <p className="font-medium">{job.salary || 'Not specified'}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <span className="text-sm text-muted-foreground">Skills: </span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {job.skills.map((skill, idx) => (
                                            <Badge key={idx} variant="outline">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Applicants List (shown when clicked) */}
                                {selectedJob?.id === job.id && (
                                    <div className="mt-6 pt-6 border-t">
                                        <h4 className="font-semibold mb-4">Applicants ({job.applicants})</h4>
                                        {job.applicants === 0 ? (
                                            <p className="text-sm text-muted-foreground">No applicants yet</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {/* Mock applicant data - this would come from backend */}
                                                {Array.from({ length: Math.min(job.applicants, 5) }).map((_, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">Candidate {idx + 1}</p>
                                                            <p className="text-sm text-muted-foreground">Applied 2 days ago</p>
                                                        </div>
                                                        <Button size="sm" variant="outline">
                                                            View Profile
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
