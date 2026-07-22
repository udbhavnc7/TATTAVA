# Tattva: AI-Powered Engineering Study Workspace

**Tattva** (Tattva AI Workspace) is an intelligent, syllabus-grounded workspace engineered specifically for university engineering students preparing for rigorous semester exams (e.g., Computer Networks, Database Management Systems, Operating Systems, Data Structures).

Powered by Retrieval-Augmented Generation (RAG) and Gemini AI, Tattva transforms raw PDF textbooks, lecture slides, and university syllabi into interactive, exam-targeted study tools without hallucination or fluff.

---

## 🌟 Key Features & Modules

### 📚 1. RAG Notes Engine
- **Syllabus & PDF Vector Ingestion**: Upload course PDFs, lecture slides, or textbook chapters.
- **Exam-Tiered Notes**: Generate study notes tailored precisely to university question marking schemes:
  - **2-Mark**: Concise, core definitions with formula highlights.
  - **6-Mark**: Comparative analysis, bulleted steps, and mid-depth explanations.
  - **10-Mark**: Comprehensive essays with formal proofs, algorithms, and complete mathematical derivations.
- **LaTeX Math Rendering**: Native support for inline and block LaTeX equations using KaTeX.
- **Factual Grounding**: Every note explicitly references the textbook source file and page numbers with confidence badges.

### 📊 2. Dynamic Mermaid Diagrams
- Automatically converts complex technical concepts (e.g., Dijkstra's algorithm, 3NF vs BCNF normalization trees, bit-stuffing protocols) into clean, interactive **Mermaid.js** flowcharts and sequence diagrams.

### 📐 3. Formula & Equation Extractor
- Automatically scans indexed documents and compiles a clean, dedicated **Formula Sheet**.
- Displays mathematical equations, variable definitions, and textbook page citations in an easily scannable, copyable table layout.

### 🃏 4. Active Recall Flashcards
- Generates exam-focused flip cards directly grounded in your course materials.
- Includes confidence tracking and source citations on card backs for efficient active recall.

### 💬 5. Socratic Doubt Solver
- Context-aware AI study assistant that answers specific student doubts using uploaded course documents.
- Employs a **Socratic approach**: Provides structured conceptual breakdowns followed by reflective check-in questions to reinforce understanding.

### 📑 6. Previous Year Questions (PYQ) Manager
- Organize past semester question papers by module, mark weightage (2, 6, 10 marks), and repetition frequency.
- Generate model answers with step-by-step solutions verified against syllabus notes.

### 🎯 7. Syllabus Coverage Tracker
- Visual progress dashboard to monitor syllabus completion across modules and subjects.
- Track confidence metrics and exam readiness scores.

### ⚡ 8. Offline & Fallback Resiliency
- Built-in domain-expert offline fallback engine for key engineering subjects (Computer Networks, DBMS, Physical Layer) so the app remains fully functional even without an active Gemini API key.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation

1. **Clone the repository** (or extract project directory):
   ```bash
   git clone https://github.com/udbhavnc7/tattva-ai-workspace.git
   cd tattva-ai-workspace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root (see `.env.example`):
   ```env
   # Optional: Provide Gemini API key for live AI generation
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If `GEMINI_API_KEY` is omitted, Tattva automatically falls back to its built-in offline engineering knowledge base.*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion
- **Math Rendering**: KaTeX (`katex`)
- **Diagrams**: Mermaid (`mermaid`)
- **Markdown Rendering**: React Markdown with math plugins (`react-markdown`, `remark-math`, `rehype-katex`)
- **Backend**: Node.js, Express, ESBuild / TSX
- **AI Integration**: `@google/genai` (Google Gemini SDK) with custom RAG vector similarity and chunking pipeline

---

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── WorkspaceHub.tsx      # Main layout & module navigator
│   │   ├── NotesEngine.tsx       # RAG Notes generation & document viewer
│   │   ├── FormulaSheet.tsx      # LaTeX Formula sheet extractor
│   │   ├── FlashcardsReview.tsx  # Active recall flashcards module
│   │   ├── DoubtSolver.tsx       # Socratic AI tutor chat
│   │   ├── PYQManager.tsx        # Past year questions manager
│   │   └── CoverageTracker.tsx   # Syllabus progress & confidence dashboard
│   ├── server/
│   │   ├── db.ts                 # Database & vector index store
│   │   └── gemini.ts             # Gemini AI API handlers & offline fallbacks
│   ├── App.tsx                   # Main React entry component
│   └── main.tsx                  # React DOM root
├── server.ts                     # Express server & Vite integration
├── package.json
└── vite.config.ts
```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
