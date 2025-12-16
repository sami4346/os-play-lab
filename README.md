# Smart OS Simulator (os-play-lab)

Interactive playground for OS scheduling, memory allocation, page replacement, and an AI learning assistant.

## Features

- CPU scheduler lab: create random or manual processes; run FCFS, SJF, SRJF, RR (time quantum), Priority, and RR+Priority; view Gantt chart, comparative metrics, feedback, and scoreboard.

- Memory management: first/best/worst-fit allocation, fragmentation display, compaction control, and memory layout visualizer.

- Page replacement studio: FIFO, LRU, Optimal, and Clock with step-by-step animation, speed control, predefined patterns, stats, and full algorithm comparison.

- AI assistant and learning hub: chat page backed by Flask + Gemini (or a local OS knowledge base) plus curated reading lists and tips.

- UX & accessibility: responsive collapsible sidebar, keyboard shortcuts (Ctrl+H/C/P/L/,/K, F1), floating action button, screen-reader announcements, toasts, and loading states.

## Architecture
- `frontend/`: Vite + React + TypeScript + Tailwind + shadcn/ui. Pages for the simulator, chat, learning, settings, and page replacement; core logic in `src/logic`, UI primitives in `src/components/ui`.

- `backend/`: Flask API for ML recommendations and chat. `/api/suggest-algorithm` uses `MLScheduler` (RandomForest + heuristics, cached in `ml_scheduler.pkl`) to pick a scheduler; `/api/chat` proxies Gemini when `GEMINI_API_KEY` is set and falls back to an OS knowledge base.

- `ml_scheduler.pkl`: pre-trained model loaded at startup; regenerated automatically if missing or incompatible.

## Prerequisites
- Node.js 18+ and npm.
- Python 3.10+ (with pip/venv) for the optional backend.
- Optional: `GEMINI_API_KEY` (backend) to enable Gemini responses; otherwise the chatbot uses local knowledge.

## Frontend (dev/build)

- `cd frontend`
- `npm install`
- `npm run dev` (default http://localhost:5173). Set `VITE_API_BASE=http://localhost:5000` to point at the backend.
- `npm run build` to produce the production bundle; `npm run preview` to serve the build locally.
- `npm run lint` for static checks.

## Backend (optional: ML + chat API)

- Set `GEMINI_API_KEY=<your-key>` if you want Gemini answers; otherwise only the knowledge base is used.
- `cd backend`
- `python -m venv .venv`
- `.\.venv\Scripts\Activate.ps1`
- `pip install -r requirements.txt`
- Run `python api.py` (serves on http://localhost:5000 with CORS for the frontend ports).
- The ML recommender loads `ml_scheduler.pkl` if present; if missing or incompatible it self-trains on synthetic data and saves a fresh model.

## Using the simulator

- Home: generate or add processes, choose scheduler and memory mode, optionally enable ML suggestion, set time quantum, then start simulation to see memory layout, process state animation, Gantt chart, metrics, comparative analysis, and feedback/score updates. Use the compact memory action to reduce fragmentation; reset to start over.

- Page Replacement: open Page Replacement, edit or generate reference strings, select frames and algorithm, run simulation, animate steps, and compare algorithms side-by-side with stats and insights.

- Chat/Learn: ask OS questions in Chat (requires backend for remote/knowledge-base answers) and browse curated learning resources; use keyboard shortcuts or the floating action button to navigate quickly.

## Repository layout

- `frontend/src/logic/`: scheduling, memory allocation, metrics, and page replacement algorithms.

- `frontend/src/components/`: simulator UI, visualizers, charts, toasts, navigation, accessibility helpers.

- `frontend/src/pages/`: routed pages (Home, Page Replacement, Chat, Learn, Settings, 404).

- `backend/`: Flask app and ML scheduler code.

## Troubleshooting

- Chat offline? Ensure `python api.py` is running on port 5000 and `VITE_API_BASE` points to it; without GEMINI_API_KEY the chatbot still answers from the built-in OS knowledge base.

- If the ML suggestion endpoint errors, delete `backend/ml_scheduler.pkl` and restart to retrain on synthetic data.
