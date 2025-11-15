# 📋 ProactiveIndia

**ProactiveIndia** is an AI-powered civic-tech platform that empowers citizens by providing real-time updates on government projects. It enables the public to track project progress, give feedback, and report corruption anonymously with AI-assisted analysis. Contractors update project developments, ensuring accountability, while the government oversees execution with intelligent insights. This initiative fosters civic engagement, combats corruption, and promotes proactive participation in national development.

**🔗 Deployed Link**: [ProactiveIndia](https://www.proactiveindia.site/)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Technical Stack & Architecture](#technical-stack--architecture)
- [AI & LLM Integration](#ai--llm-integration)
- [Project Impact & Scale](#project-impact--scale)
- [Future Enhancements](#future-enhancements)
- [Links](#links)

## 🎯 Project Overview

**Proactive India** is a full-stack platform built to promote transparency, accountability, and citizen participation in government projects. It connects citizens, contractors, and government officials through real-time project tracking, public feedback, AI-assisted anonymous reporting, and intelligent project analytics.

## ✨ Features

- **Real-time Updates**: Citizens receive real-time updates on the progress of government projects.
- **AI-Powered Report Analysis**: Intelligent corruption report validation, scoring, and summarization using Google Gemini.
- **Feedback Mechanism**: Users can provide feedback on ongoing projects with sentiment analysis.
- **Anonymous Reporting**: Report corruption anonymously to ensure safety and encourage transparency.
- **Contractor Updates**: Contractors can update project developments, ensuring accountability.
- **Government Oversight**: Government officials can oversee project execution with AI-generated insights and compliance monitoring.
- **Project Health Dashboards**: AI-driven summaries, risk assessment, and financial health analysis.
- **Multi-channel Notifications**: Real-time alerts via email and SMS (Twilio integration).

## 🔄 How It Works

1. **Project Listing**: All government projects are listed on the platform with detailed descriptions and timelines.
2. **Real-time Tracking**: Citizens can track the progress of each project in real-time.
3. **Feedback and Reporting**: Users can provide feedback and report any issues or corruption anonymously.
4. **AI Analysis**: Reports are automatically analyzed, scored for severity, and validated by AI.
5. **Contractor Updates**: Contractors update the status of their projects regularly.
6. **Government Monitoring**: Government officials monitor the updates and feedback with AI-generated insights to ensure proper execution and address any issues.

## 🛠️ Technical Stack & Architecture

### **Frontend (Next.js + TypeScript + React)**

- **Framework**: Next.js 14 with TypeScript for type-safe development
- **UI Library**: React with modern hooks and context API
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context (AuthContext, AppContext)
- **Key Features**:
  - Role-based layouts (Citizen, Contractor, Government)
  - Real-time project tracking dashboards
  - Interactive feedback and reporting interfaces
  - Responsive, adaptive UI design
  - Image handling with file drop & upload
  - Notification system

### **Backend (Node.js + TypeScript + Express)**

- **Repository**: [proact_backend](https://github.com/ajstudd/proact_backend)
- **Runtime**: Node.js with TypeScript for type-safe development
- **Framework**: Express.js with modular MVC architecture
- **Database**: MongoDB with Mongoose ODM for schema-based modeling
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Storage**: GridFS for scalable file and image storage
- **API Design**: RESTful APIs with middleware-based validation (Joi)
- **Real-time Features**: Notification system for user engagement
- **Services Architecture**: 15+ service modules including:
  - User, Auth, Project, Post, Comment services
  - AI Analysis, Report, Notification services
  - Email (Nodemailer) & SMS (Twilio) integration
  - File upload with Multer & Sharp for image processing

**Key Backend Highlights:**

- 13 RESTful route modules with role-based access control
- Pagination middleware for efficient data handling
- Custom error handling with HttpError helpers
- TypeScript types & interfaces for maintainability
- Environment-based configuration management

## 🤖 AI & LLM Integration (Google Gemini)

### **Core AI Implementation**

Using **Google Gemini 1.5 Flash** (`@google/generative-ai` SDK), the platform leverages LLMs for:

#### **1. Intelligent Corruption Report Analysis**

- **Content Moderation**: Multi-stage filtering for inappropriate content
  - Abusive language detection
  - Pornography & hate speech filtering
  - Context-aware validation (accepts legitimate corruption claims)
- **AI-Powered Report Scoring**:
  - Severity scoring (1-10 scale)
  - Automatic summarization (max 100 words)
  - Validity assessment
  - Tag generation for categorization
  - Detection of missing information

**Prompt Engineering Highlights:**

- JSON-structured responses for parsing
- Multi-step analysis (moderation → analysis)
- Fallback mechanisms when API unavailable
- Response cleaning & validation

#### **2. Sentiment Analysis on Public Comments**

- Real-time sentiment detection (positive/negative/neutral)
- Keyword-based fallback for resilience
- Used in aggregate project analysis

#### **3. AI-Generated Project Insights**

- Automated project summaries from updates & reports
- Financial health analysis (budget vs expenditure)
- Risk assessment & recommendations
- Aggregate sentiment analysis across all comments
- Progress tracking with AI-generated interpretations

**Advanced Features:**

- Multi-source data aggregation (comments, reports, updates)
- Context-aware prompt construction with project metrics
- Structured JSON output parsing
- Error-resilient AI workflows

## 📊 Project Impact & Scale

### **Data Models**

12+ Mongoose schemas including:

- User (role-based: citizen/contractor/official)
- Project (government projects)
- Post (updates from contractors)
- Comment (public feedback)
- Report (corruption reports)
- Notification (real-time alerts)
- ProjectAnalysis (AI-generated insights)
- AggregateAnalysis (system-wide metrics)

### **AI-Driven Features**

1. **Anonymous Reporting**: AI validates & scores reports
2. **Public Sentiment Tracking**: Comment sentiment analysis
3. **Project Health Dashboards**: AI-generated summaries
4. **Risk Detection**: Severity scoring for prioritization
5. **Actionable Insights**: Data-backed recommendations for authorities

## 🚀 Key Technical Achievements

- **Full-stack proficiency**: Node.js backend + Next.js frontend
- **AI/LLM expertise**: Google Gemini integration with custom prompt engineering
- **Real-world problem-solving**: Civic accountability through technology
- **Production readiness**: Authentication, file handling, error management
- **Scalable architecture**: Modular services, TypeScript types, middleware patterns
- **Social impact**: Making governance transparent & interactive

## 💡 Future Enhancements

- **Vector Database (Pinecone/Weaviate)**: Semantic search across reports
- **RAG Implementation**: Query historical corruption patterns
- **LangChain Integration**: Advanced agent workflows for automated investigation
- **Multi-modal AI**: Image analysis for construction progress verification
- **OpenAI Function Calling**: Structured tool use for data extraction
- **Enhanced Analytics**: Predictive modeling for project delays and budget overruns

## 🔗 Links

**Backend Repository**: [proact_backend](https://github.com/ajstudd/proact_backend)  
**Owner**: ajstudd

---

**Tech Stack**: Node.js, TypeScript, MongoDB, Express, Google Gemini, Next.js, React, Tailwind CSS  
**Key Focus**: Civic Tech + LLM Integration + Full-Stack Development
