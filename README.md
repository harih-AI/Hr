# 🚀 TalentScout AI - Agentic AI Hiring Platform

An intelligent, AI-powered hiring platform that automates resume screening, conducts AI interviews, and provides data-driven hiring recommendations.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Application Structure](#application-structure)
- [Key Features](#key-features)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)

---

## ✨ Features

### For HR Teams
- **📄 Resume Upload & Parsing** - Upload and automatically parse candidate resumes
- **🤖 AI Interview System** - Automated AI-powered interviews with resume-based questions
- **✅ Candidate Approval Workflow** - Review, approve, reject, or waitlist candidates
- **💼 Job Posting Agent** - Conversational AI to create job postings
- **📊 Analytics Dashboard** - Track hiring metrics and candidate pipeline
- **🎯 Smart Recommendations** - AI-powered hiring recommendations

### For Candidates
- **📱 Candidate Portal** - Personal dashboard for application tracking
- **🎥 AI Interview** - Interactive interview with camera proctoring
- **📈 Progress Tracking** - Real-time application status updates
- **✉️ Notifications** - Get notified when approved for interviews

### AI-Powered Features
- **Resume-Based Questions** - Interview questions generated from candidate's resume
- **Adaptive Questioning** - AI adjusts difficulty based on responses
- **Technical Evaluation** - Deep technical assessment
- **Bias Detection** - Fair and unbiased evaluation
- **Performance Tracking** - Detailed interview analytics

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TanStack Query** for data fetching
- **Tailwind CSS** for styling
- **Shadcn UI** for components
- **Zustand** for state management

### Backend
- **Node.js** with TypeScript
- **Fastify** web framework
- **Ollama** for local LLM (phi3:mini)
- **PDF parsing** for resume extraction
- **In-memory storage** (can be replaced with database)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Ollama installed with phi3:mini model
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd talentscout-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Ollama model**
```bash
ollama pull phi3:mini
```

4. **Start the application**
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:8081
- **Backend**: http://localhost:3000

---

## 📁 Application Structure

```
talentscout-ai/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── candidate/   # Candidate portal pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Hiring.tsx
│   │   │   ├── CandidateApproval.tsx
│   │   │   └── JobPosting.tsx
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API services
│   │   └── store/          # State management
│   └── package.json
│
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── agents/         # AI agents
│   │   │   ├── interview-exec.agent.ts
│   │   │   ├── technical-eval.agent.ts
│   │   │   ├── bias.agent.ts
│   │   │   └── decision.agent.ts
│   │   ├── routes/         # API routes
│   │   ├── llm/           # LLM client
│   │   └── server.ts      # Main server file
│   ├── uploads/           # Resume storage
│   └── package.json
│
├── package.json           # Root package.json
└── README.md             # This file
```

---

## 🎯 Key Features

### 1. AI Interview System

**Resume-Based Questions:**
- Questions are generated from candidate's actual resume
- References specific projects, companies, and technologies
- Validates depth of knowledge

**Example:**
```
Resume mentions: "Built e-commerce platform with React and Node.js"
AI Question: "In your e-commerce project, how did you handle state 
management in React? Can you describe a specific challenge you faced?"
```

**Adaptive Questioning:**
- Adjusts difficulty based on answer quality
- Asks follow-up questions for shallow answers
- Moves to next topic for strong answers

**Proctoring Features:**
- Camera requirement (visible feed)
- Tab switching detection
- Violation tracking
- One-time attempt enforcement

### 2. Candidate Approval Workflow

**HR Decision Making:**
- Review AI interview results
- See AI recommendations
- Approve, Reject, or Waitlist candidates
- Add custom reasoning

**Status Propagation:**
- Decisions saved to backend
- Status reflected across application
- Candidates notified of approval

### 3. Job Posting Agent

**Conversational Creation:**
- AI guides through 8 questions
- Collects job details step-by-step
- Previews before publishing

**Questions Asked:**
1. Job Role / Title
2. Department
3. Job Description
4. Required Skills
5. Experience Required
6. Location
7. Salary Range (optional)
8. Employment Type

### 4. Interview Performance Tracking

**Metrics Tracked:**
- Response time per question
- Answer quality scores
- Technical depth assessment
- Communication skills
- Overall performance rating

---

## 📡 API Documentation

### Interview APIs

#### Start Interview
```http
POST /api/ai-interview/start
Content-Type: application/json

{
  "candidateId": "cand_001",
  "jobId": "job_01",
  "resumeText": "...",
  "candidateProfile": { ... }
}

Response:
{
  "sessionId": "session_123",
  "questions": [...],
  "totalQuestions": 8
}
```

#### Submit Answer
```http
POST /api/ai-interview/submit-answer
Content-Type: application/json

{
  "sessionId": "session_123",
  "questionId": "q1",
  "answer": "...",
  "responseTime": 45
}

Response:
{
  "isComplete": false,
  "nextQuestion": "..."
}
```

#### Get Evaluation
```http
GET /api/ai-interview/evaluate/:sessionId

Response:
{
  "overallScore": 85,
  "technicalScore": 90,
  "communicationScore": 80,
  "recommendation": "Strong Hire",
  "reasoning": [...]
}
```

### Candidate APIs

#### Upload Resume
```http
POST /api/upload-resume
Content-Type: multipart/form-data

file: <resume.pdf>

Response:
{
  "candidateId": "cand_001",
  "name": "John Doe",
  "skills": [...],
  "experience": [...]
}
```

#### Approve Candidate
```http
POST /api/approve/:candidateId

Response:
{
  "status": "Approved",
  "message": "Candidate approved for interview"
}
```

### HR Decision APIs

#### Save Decision
```http
POST /api/interviews/decision
Content-Type: application/json

{
  "candidateId": "cand_001",
  "decision": "approved",
  "reasoning": "Strong technical skills"
}

Response:
{
  "status": 200,
  "message": "Decision saved successfully"
}
```

---

## 📖 Usage Guide

### For HR Teams

#### 1. Upload Candidate Resume
```
1. Go to Hiring Console (http://localhost:8081/hiring)
2. Click "Upload Resume"
3. Select PDF file
4. System parses and creates candidate profile
```

#### 2. Approve Candidate for Interview
```
1. View candidate in hiring console
2. Click "Approve" button
3. Candidate status changes to "Approved"
4. Candidate sees interview invitation
```

#### 3. Review Interview Results
```
1. Go to Candidate Approval (http://localhost:8081/approval)
2. View AI recommendations
3. Review interview transcript
4. Make decision (Approve/Reject/Waitlist)
5. Add custom reasoning
6. Submit decision
```

#### 4. Create Job Posting
```
1. Go to Job Postings (http://localhost:8081/jobs)
2. Click "Create New Job"
3. Answer AI agent's questions
4. Review preview
5. Confirm and publish
```

### For Candidates

#### 1. Check Dashboard
```
1. Go to Candidate Dashboard (http://localhost:8081/candidate/dashboard)
2. View application status
3. See interview invitation (if approved)
```

#### 2. Take AI Interview
```
1. Click "Start Interview Now"
2. Read proctoring instructions
3. Grant camera permission
4. Answer questions one by one
5. Submit final answer
6. View results
```

---

## 🔒 Interview Proctoring

### Active Monitoring
- ✅ Camera feed visible throughout
- ✅ Tab switching detected and counted
- ✅ Window minimizing tracked
- ✅ All violations timestamped

### Violations Tracked
- Tab switches
- Window minimizes
- Timestamps for each violation
- Total violation count

### One-Time Attempt
- Interview can only be taken once
- Tracked via localStorage
- Prevents retakes

---

## 🎨 UI/UX Features

### Responsive Design
- Mobile-friendly layouts
- Adaptive navigation
- Touch-optimized controls

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- ARIA labels

### Visual Feedback
- Loading states
- Success/error messages
- Progress indicators
- Status badges

---

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000
```

**Backend (.env)**
```env
PORT=3000
OLLAMA_URL=http://localhost:11434
MODEL_NAME=phi3:mini
```

### Ollama Configuration

The system uses Ollama with the phi3:mini model for:
- Interview question generation
- Answer evaluation
- Technical assessment
- Bias detection

**Install Ollama:**
```bash
# Download from https://ollama.ai
ollama pull phi3:mini
```

---

## 📊 Performance Metrics

### Interview Analytics
- Average response time
- Question difficulty distribution
- Pass/fail rates
- Common strengths/weaknesses

### Hiring Metrics
- Time to hire
- Candidate pipeline status
- Approval rates
- Interview completion rates

---

## 🐛 Troubleshooting

### Common Issues

**1. Ollama not responding**
```bash
# Check if Ollama is running
ollama list

# Restart Ollama
ollama serve
```

**2. Camera not working**
- Grant browser camera permissions
- Check if camera is in use by another app
- Try different browser

**3. Interview not loading**
- Check backend is running on port 3000
- Verify Ollama model is downloaded
- Check browser console for errors

---

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Serve dist/ folder
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

### Docker (Optional)

```dockerfile
# Dockerfile example
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 📝 License

This project is proprietary software.

---

## 🤝 Support

For issues or questions:
- Check documentation above
- Review API documentation
- Check browser console for errors

---

## 🎯 Key Highlights

✅ **Resume-Based Questions** - AI generates questions from actual resume
✅ **Adaptive Interviews** - Difficulty adjusts based on responses
✅ **Fair Evaluation** - Bias detection and mitigation
✅ **Complete Workflow** - From resume upload to hiring decision
✅ **Real-time Proctoring** - Camera monitoring and violation tracking
✅ **AI-Powered** - Uses local LLM (Ollama) for privacy

---

**Built with ❤️ using AI-first principles**
