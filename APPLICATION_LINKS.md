# 🚀 TalentScout AI - Application Links

## 🌐 Main Application URLs

### **Frontend (Main App)**
```
http://localhost:8081
```
**Default landing page with navigation**

---

## 📋 HR Portal Pages

### **Dashboard**
```
http://localhost:8081/
```
Main command center with overview

### **Hiring Console**
```
http://localhost:8081/hiring
```
Upload resumes and manage candidates

### **Candidate Approval**
```
http://localhost:8081/approval
```
Review interview results and make decisions (Approve/Reject/Waitlist)

### **Job Postings** ⭐ NEW
```
http://localhost:8081/jobs
```
AI-powered conversational job posting agent

### **People Intelligence**
```
http://localhost:8081/people
```
Team analytics and insights

### **Executive Command**
```
http://localhost:8081/executive
```
Executive-level overview

### **Admin Panel**
```
http://localhost:8081/admin
```
System administration

---

## 👤 Candidate Portal Pages

### **Candidate Dashboard**
```
http://localhost:8081/candidate/dashboard
```
Candidate's main dashboard

### **AI Interview Portal** ⭐ UPDATED (No Fullscreen)
```
http://localhost:8081/candidate/ai-interview?jobId=job_01
```
Start AI-powered interview (runs in normal browser mode)

### **Interview Results**
```
http://localhost:8081/candidate/interview-results?sessionId=SESSION_ID
```
View interview results after completion

---

## 🔧 Backend API

### **API Base URL**
```
http://localhost:3000
```

### **Key Endpoints**

#### Interview APIs
- `GET /api/interviews` - Get all interview results
- `GET /api/interviews/:candidateId` - Get specific candidate results
- `POST /api/interviews/save` - Save interview results
- `GET /api/interviews/stats/summary` - Get statistics
- `POST /api/interviews/decision` - Save HR decision ⭐ NEW

#### AI Interview APIs
- `POST /api/ai-interview/start` - Start interview session
- `POST /api/ai-interview/submit-answer` - Submit answer
- `GET /api/ai-interview/evaluate/:sessionId` - Get evaluation

#### Hiring APIs
- `GET /api/candidates` - Get all candidates
- `POST /api/upload-resume` - Upload resume
- `POST /api/approve/:id` - Approve candidate

---

## 🎯 Quick Start Guide

### **For HR:**
1. Open: `http://localhost:8081`
2. Navigate to **Job Postings** to create a job
3. Go to **Hiring Console** to upload candidate resumes
4. Check **Candidate Approval** to review interview results

### **For Candidates:**
1. Open: `http://localhost:8081/candidate/dashboard`
2. Click "Start Interview" for a job
3. Grant camera permission
4. Answer questions (in normal browser mode)
5. View results after completion

---

## ✨ New Features

### **1. Job Posting Agent**
- Conversational AI guides you through job creation
- Asks 8 questions step-by-step
- Shows applicant counts
- Expandable applicant details

**Access:** `http://localhost:8081/jobs`

### **2. Candidate Approval Workflow**
- AI-powered recommendations
- Approve/Reject/Waitlist decisions
- Custom reasoning support
- Decisions saved to backend

**Access:** `http://localhost:8081/approval`

### **3. Normal Browser Mode Interview**
- No fullscreen (navigation always visible)
- Camera still required
- Tab switching tracked
- One-time attempt enforced

**Access:** `http://localhost:8081/candidate/ai-interview?jobId=job_01`

---

## 🔍 Testing Scenarios

### **Test Job Posting:**
1. Go to: `http://localhost:8081/jobs`
2. Click "Create New Job"
3. Follow the AI agent's questions
4. Confirm and publish

### **Test Interview:**
1. Go to: `http://localhost:8081/candidate/ai-interview?jobId=job_01`
2. Read instructions
3. Click "I Understand - Start Interview"
4. Grant camera permission
5. Answer questions
6. Submit and view results

### **Test Approval:**
1. Complete an interview (above)
2. Go to: `http://localhost:8081/approval`
3. Review AI recommendation
4. Add custom notes (optional)
5. Click Approve/Waitlist/Reject

---

## 📊 Server Status

### **Frontend Server**
- Port: `8081`
- Status: ✅ Running
- Framework: Vite + React

### **Backend Server**
- Port: `3000`
- Status: ✅ Running
- Framework: Fastify + Node.js

---

## 🎨 Navigation Menu

The sidebar includes:
1. **Command Center** - Dashboard
2. **AI Agents** - AI features
3. **Hiring Console** - Candidate management
4. **Candidate Approval** - Decision workflow ⭐
5. **Job Postings** - Job creation ⭐
6. **People Intelligence** - Analytics
7. **Executive Command** - Executive view
8. **Admin Panel** - Settings

---

## 🔐 Proctoring Features

### **Active:**
- ✅ Camera requirement
- ✅ Tab switching detection
- ✅ Violation tracking
- ✅ One-time attempt
- ✅ HR reporting

### **Removed:**
- ❌ Fullscreen mode
- ❌ Fullscreen violations
- ❌ Warning banners

---

## 📱 Browser Compatibility

**Recommended:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**All features work in normal browser mode!**

---

## 🚀 Quick Links Summary

| Page | URL |
|------|-----|
| **Main App** | http://localhost:8081 |
| **Job Postings** | http://localhost:8081/jobs |
| **Candidate Approval** | http://localhost:8081/approval |
| **AI Interview** | http://localhost:8081/candidate/ai-interview?jobId=job_01 |
| **API Docs** | http://localhost:3000 |

---

**Everything is running and ready to use! 🎉**
