# 📁 Project Structure

## Overview
TalentScout AI is organized as a monorepo with frontend and backend workspaces.

```
talentscout-ai/
├── frontend/                    # React + TypeScript frontend
├── backend/                     # Node.js + TypeScript backend
├── node_modules/               # Shared dependencies
├── package.json                # Root workspace configuration
├── package-lock.json
├── README.md                   # Main documentation
├── APPLICATION_LINKS.md        # Quick access links
└── INTERVIEW_PROCTORING_SYSTEM.md  # Proctoring details
```

---

## Frontend Structure

```
frontend/
├── src/
│   ├── pages/                  # Page components
│   │   ├── Dashboard.tsx       # HR dashboard
│   │   ├── Hiring.tsx          # Resume upload & management
│   │   ├── CandidateApproval.tsx  # Review & approve candidates
│   │   ├── JobPosting.tsx      # AI job posting agent
│   │   └── candidate/          # Candidate portal
│   │       ├── Dashboard.tsx   # Candidate dashboard
│   │       ├── AIInterviewPortal.tsx  # Interview interface
│   │       └── InterviewResults.tsx   # Results page
│   │
│   ├── components/             # Reusable components
│   │   ├── layout/            # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── CandidateLayout.tsx
│   │   │   └── AppSidebar.tsx
│   │   ├── ui/                # UI primitives (shadcn)
│   │   └── candidate/         # Candidate-specific components
│   │
│   ├── services/              # API services
│   │   ├── aiInterview.ts    # Interview API calls
│   │   ├── candidates.ts     # Candidate API calls
│   │   └── api.ts            # Base API configuration
│   │
│   ├── store/                 # State management (Zustand)
│   │   ├── useAuthStore.ts
│   │   ├── useProfileStore.ts
│   │   ├── useApplicationStore.ts
│   │   └── useInterviewStore.ts
│   │
│   ├── lib/                   # Utilities
│   │   └── utils.ts
│   │
│   ├── App.tsx                # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
│
├── public/                    # Static assets
├── index.html                # HTML template
├── package.json              # Frontend dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite configuration
└── tailwind.config.js        # Tailwind CSS config
```

---

## Backend Structure

```
backend/
├── src/
│   ├── agents/                # AI Agents
│   │   ├── interview-exec.agent.ts    # Interview execution
│   │   ├── technical-eval.agent.ts    # Technical evaluation
│   │   ├── bias.agent.ts              # Bias detection
│   │   └── decision.agent.ts          # Final decision
│   │
│   ├── routes/                # API Routes
│   │   ├── interviews.ts      # Interview endpoints
│   │   ├── candidates.ts      # Candidate endpoints
│   │   └── hiring.ts          # Hiring endpoints
│   │
│   ├── llm/                   # LLM Integration
│   │   └── client.ts          # Ollama client
│   │
│   ├── core/                  # Core types & logic
│   │   └── types.ts           # TypeScript types
│   │
│   ├── utils/                 # Utilities
│   │   └── logger.ts          # Logging utility
│   │
│   ├── data.ts                # In-memory data store
│   └── server.ts              # Main server file
│
├── uploads/                   # Resume storage
│   └── [candidate_name]/      # Per-candidate folder
│       └── resume.pdf
│
├── package.json              # Backend dependencies
├── tsconfig.json             # TypeScript config
└── .env                      # Environment variables
```

---

## Key Files

### Root Level

**package.json**
```json
{
  "name": "talentscout-ai-monorepo",
  "workspaces": ["frontend", "backend"],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "npm run dev -w backend",
    "dev:frontend": "npm run dev -w frontend"
  }
}
```

### Frontend

**App.tsx** - Main routing and layout
**pages/** - All page components
**services/** - API integration
**store/** - Global state management

### Backend

**server.ts** - Express/Fastify server setup
**agents/** - AI agent implementations
**routes/** - REST API endpoints
**llm/client.ts** - Ollama integration

---

## Data Flow

### Interview Flow
```
1. Frontend (AIInterviewPortal.tsx)
   ↓
2. Service (aiInterview.ts)
   ↓
3. Backend Route (/api/ai-interview/start)
   ↓
4. Interview Agent (interview-exec.agent.ts)
   ↓
5. LLM Client (Ollama)
   ↓
6. Response back to frontend
```

### Resume Upload Flow
```
1. Frontend (Hiring.tsx)
   ↓
2. Multipart form upload
   ↓
3. Backend Route (/api/upload-resume)
   ↓
4. PDF parsing
   ↓
5. Store in uploads/ folder
   ↓
6. Create candidate profile
   ↓
7. Return to frontend
```

---

## Important Directories

### `/frontend/src/pages/`
All page-level components. Each page represents a route.

### `/backend/src/agents/`
AI agents that power the interview system:
- **interview-exec** - Conducts interviews
- **technical-eval** - Evaluates technical skills
- **bias** - Detects bias
- **decision** - Makes hiring recommendations

### `/backend/uploads/`
Stores uploaded resumes organized by candidate name.

---

## Configuration Files

### Frontend
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS setup
- `tsconfig.json` - TypeScript compiler options

### Backend
- `tsconfig.json` - TypeScript compiler options
- `.env` - Environment variables (not in repo)

---

## Dependencies

### Frontend Key Packages
- `react` - UI framework
- `react-router-dom` - Routing
- `@tanstack/react-query` - Data fetching
- `zustand` - State management
- `tailwindcss` - Styling
- `lucide-react` - Icons

### Backend Key Packages
- `fastify` - Web framework
- `@fastify/multipart` - File uploads
- `pdf-parse` - PDF parsing
- `ollama` - LLM integration

---

## Build Output

### Frontend Build
```
frontend/dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── ...
```

### Backend Build
```
backend/dist/
├── server.js
├── agents/
├── routes/
└── ...
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```env
PORT=3000
OLLAMA_URL=http://localhost:11434
MODEL_NAME=phi3:mini
```

---

## Clean Structure

The project is now cleaned up with only essential files:
- ✅ README.md - Main documentation
- ✅ APPLICATION_LINKS.md - Quick links
- ✅ INTERVIEW_PROCTORING_SYSTEM.md - Proctoring details
- ✅ INTERVIEW_PERFORMANCE_TRACKING.md - Performance metrics
- ✅ Source code (frontend/ and backend/)
- ❌ Removed all temporary documentation files

---

This structure provides a clean, organized codebase that's easy to navigate and maintain.
