export const candidates = [
    {
        id: 'c1',
        name: 'Sarah Chen',
        role: 'Senior Full Stack Engineer',
        status: 'Shortlisted',
        score: 94,
        department: 'Engineering',
        email: 'sarah.chen@example.com',
        experience: '8 years',
        skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        matchReason: 'Strong background in distributed systems and cloud architecture.',
        resumeUrl: '/uploads/sarah_chen_resume.pdf'
    },
    {
        id: 'c2',
        name: 'Marcus Rodriguez',
        role: 'Product Designer',
        status: 'Interviewing',
        score: 88,
        department: 'Design',
        email: 'm.rodriguez@example.com',
        experience: '5 years',
        skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
        matchReason: 'Excellent portfolio with a focus on accessibility and design systems.',
        resumeUrl: '/uploads/marcus_resume.pdf'
    },
    {
        id: 'c3',
        name: 'Alex Thompson',
        role: 'Backend Developer',
        status: 'Applied',
        score: 76,
        department: 'Engineering',
        email: 'alex.t@example.com',
        experience: '3 years',
        skills: ['Go', 'Kubernetes', 'Redis', 'gRPC'],
        matchReason: 'Good technical skills but limited experience with our specific stack.',
        resumeUrl: '/uploads/alex_t_resume.pdf'
    },
    {
        id: 'c4',
        name: 'John Doe',
        role: 'Full Stack Developer',
        status: 'Applied',
        score: 82,
        department: 'Engineering',
        email: 'john.doe@example.com',
        experience: '4 years',
        skills: ['React', 'Node.js', 'Python', 'Docker'],
        matchReason: 'Strong match for the Full Stack role with AI experience.',
        resumeUrl: '/uploads/john_doe_resume.pdf'
    }
];

export const defaultInterviewPlan = {
    focus: ['Full Stack Development', 'AI Integration', 'System Design'],
    sections: [
        {
            topic: 'Core Experience',
            purpose: 'General background verification',
            questions: [
                'DEBUG FALLBACK: Tell me about your most significant project and the specific technologies you used.',
                'DEBUG FALLBACK: How do you stay updated with the latest trends in the software industry?'
            ],
            weight: 1
        },
        {
            topic: 'Collaboration & Growth',
            purpose: 'Soft skills and adaptability',
            questions: [
                'How do you stay updated with rapidly evolving tech stacks like the one mentioned in your profile?',
                'Tell me about a time you had to explain a complex technical concept to a non-technical stakeholder.'
            ],
            weight: 1
        }
    ],
    estimatedDuration: 15,
    difficultyLevel: 'mid' as any
};

export const profile = {
    id: 'u1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    headline: 'Full Stack Developer | AI Enthusiast',
    phone: '+1 234 567 890',
    summary: 'Experienced developer with a passion for building AI-powered applications.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    links: {
        linkedin: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe',
        portfolio: 'johndoe.dev'
    },
    resumeUrl: '/uploads/john_doe_resume.pdf' as string | null,
    status: 'Applied',
    skills: {
        technical: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'],
        soft: ['Leadership', 'Communication'],
        tools: ['Git', 'Jira']
    },
    experience: [
        {
            company: 'Tech Solutions Inc',
            role: 'Full Stack Developer',
            duration: '2020 - Present',
            responsibilities: ['Developed React frontends', 'Built Node.js microservices']
        }
    ],
    totalYearsOfExperience: 4
};
