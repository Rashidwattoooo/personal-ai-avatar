# Personal AI Avatar Assistant

> **Interactive Client Demo**: Web-based conversational AI avatar with real-time two-way voice dialogue, enterprise RAG knowledge retrieval, and live camera vision preview.

---

## 1. Project Overview

This project delivers a working MVP for a **Personal AI Avatar Assistant**. Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, it integrates with **Tavus Conversational Video Interface (CVI)** for low-latency (<800ms) photorealistic digital human video and speech, combined with **Tavus Knowledge Base** for Retrieval-Augmented Generation (RAG).

### Key Features
- 🎙 **Two-Way Voice Interaction**: Talk naturally via microphone. The avatar listens, reasons, and responds with synchronized lip movement.
- 👤 **Lifelike Visual AI Avatar**: Powered by Tavus neural video rendering.
- 🧠 **RAG Grounded Intelligence**: Answers questions based on private enterprise documents via Tavus Knowledge Base.
- 📷 **Camera Vision & Local Preview**: Integrated camera preview with architecture hooks for visual perception analysis.
- 🛡 **Secure Server-Side Architecture**: Secret API keys (`TAVUS_API_KEY`) are protected inside Next.js server-side API routes and are never exposed to the client.
- 🎨 **Client-Ready UI/UX**: Dark glassmorphic design, responsive across mobile, tablet, and desktop, with diagnostic indicators, loading states, and error handling.

---

## 2. Architecture Diagram

```
Browser Client (Next.js + React + Tailwind)
  ├── User Microphone & Audio Output
  ├── Camera Preview / Local Stream
  └── WebRTC Player (Daily.co / Tavus CVI Stream)
          │
          │ 1. POST /api/conversation (Secure Server Route)
          ▼
Next.js API Route (/app/api/conversation)
  ├── Validates Environment Variables
  ├── Loads Persona, Replica, & Document IDs
  └── Calls Tavus REST API (x-api-key: TAVUS_API_KEY)
          │
          │ 2. Create Conversation Session
          ▼
Tavus CVI Platform (https://tavusapi.com/v2)
  ├── Persona / PAL (Conversation Dynamics, LLM, Tone)
  ├── Knowledge Base RAG (Document Retrieval Strategy)
  ├── Phoenix Real-Time Avatar Video Synthesis
  └── WebRTC Media Room (Low-Latency Peer Streaming)
```

---

## 3. Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **WebRTC & Realtime Video**: `@daily-co/daily-js` / Tavus CVI
- **API Runtime**: Node.js 18+ / 20+

---

## 4. Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+ LTS
- npm, pnpm, or yarn

### 1. Installation
In the project root directory:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Or on Windows PowerShell:
```powershell
Copy-Item .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Required
TAVUS_API_KEY=your_tavus_api_key_here
TAVUS_PERSONA_ID=your_persona_id_here
TAVUS_REPLICA_ID=your_replica_id_here

# Optional RAG configuration
TAVUS_DOCUMENT_IDS=
TAVUS_DOCUMENT_RETRIEVAL_STRATEGY=balanced
TAVUS_CUSTOM_GREETING=Hello! I am your personal AI avatar assistant. How can I help you today?
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 5. Tavus Account & Setup Guide

### Step 1: Create a Tavus Account
1. Visit [https://platform.tavus.io](https://platform.tavus.io) and create an account or sign in.

### Step 2: Generate an API Key
1. Navigate to **API Keys** in the left sidebar or at [https://platform.tavus.io/api-keys](https://platform.tavus.io/api-keys).
2. Click **Create Secret Key**.
3. Copy the key and add it to `.env.local` as `TAVUS_API_KEY`.

### Step 3: Choose or Create a Persona (PAL)
1. Go to **Personas** at [https://platform.tavus.io/personas](https://platform.tavus.io/personas).
2. You can use an existing persona or click **Create Persona**.
3. Set the system prompt, conversational tone, and response guidelines.
4. Copy the `persona_id` (e.g., `p12345678abc`) and set it in `.env.local` as `TAVUS_PERSONA_ID`.

### Step 4: Choose a Replica (Avatar Face)
1. Go to **Replicas** at [https://platform.tavus.io/replicas](https://platform.tavus.io/replicas).
2. Select a stock replica available in your account (or your trained custom replica).
3. Copy the `replica_id` (e.g., `r12345678abc`) and set it in `.env.local` as `TAVUS_REPLICA_ID`.

### Step 5: Add Knowledge Documents for RAG
1. In the Tavus dashboard, navigate to **Knowledge Base** (or use the `POST /v2/documents` API).
2. Upload your documents (PDF, DOCX, TXT, or Markdown). Fictional sample demo documents are provided in `./demo-knowledge/`.
3. Copy the generated `document_id` and add it to `TAVUS_DOCUMENT_IDS`:
   ```env
   TAVUS_DOCUMENT_IDS=doc_abcdef123456
   ```
   *(For multiple documents, separate with commas: `doc_1,doc_2`)*
4. Set `TAVUS_DOCUMENT_RETRIEVAL_STRATEGY=balanced` (or `speed` / `quality`).

---

## 6. How to Deploy to Vercel

1. Push this repository to GitHub or GitLab.
2. Go to [https://vercel.com/new](https://vercel.com/new) and import the repository.
3. In **Environment Variables**, add:
   - `TAVUS_API_KEY`
   - `TAVUS_PERSONA_ID`
   - `TAVUS_REPLICA_ID`
   - `TAVUS_DOCUMENT_IDS` (Optional)
   - `TAVUS_DOCUMENT_RETRIEVAL_STRATEGY` (Optional)
4. Click **Deploy**.

---

## 7. Future 3D Character Roadmap

The client specified a **"3D Character"**. This MVP uses Tavus photorealistic neural video as the production avatar layer, while isolating the avatar presentation inside `app/components/avatar/AvatarStage.tsx`.

### Extension Architecture:
- **Phase 1 (Current MVP)**:
  - Tavus stock replica neural video rendering
  - Real-time two-way voice streaming over WebRTC (<800ms)
  - Tavus Knowledge Base RAG integration
  - Camera preview & media permissions
  - Diagnostic & demo mode inspector

- **Phase 2**:
  - Custom branded client replica (trained via Tavus Studio)
  - Multimodal camera frame processing (Raven visual cue pipeline)
  - Persistent conversation memory across sessions
  - Enterprise role-based authentication

- **Phase 3 (Custom 3D Character / WebGL)**:
  - Three.js / React Three Fiber / Babylon.js canvas inside `AvatarStage.tsx`
  - 3D glTF / VRM character models with blendshapes for phoneme-based lip sync
  - Audio viseme extraction to drive jaw and mouth blendshapes in real time
  - Stylized custom 3D art styles (cartoon, hyper-realistic, or brand mascot)

---

## 8. Known Limitations & Notes

1. **Camera Vision vs. Camera Preview**:
   - The camera preview in this application provides local video feedback and prepares visual perception inputs. Direct Tavus real-time vision processing (Raven) operates through the WebRTC media room when camera tracks are enabled.
2. **Demo Mode**:
   - If Tavus API credentials are not yet configured in `.env.local`, the application boots in **Demo Setup Mode**. The Diagnostics panel clearly shows which credentials are required so you can test the UI and camera permissions without crashing.
