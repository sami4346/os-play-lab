# Smart OS Simulator (os-play-lab)

A learning-and-playground app that simulates CPU scheduling and memory management. It supports multiple scheduling algorithms, fixed/automatic memory allocation strategies, and an optional ML-based algorithm recommender.

## Key features
- Visual process table, Gantt chart and memory visualizer
- Scheduling algorithms: `FCFS`, `SJF`, `SRJF`, `RR`, `Priority`, `RR+Priority`
- Memory allocation: `firstFit`, `bestFit`, `worstFit`, manual assignment, and compaction
- Rule-based feedback system that suggests a good scheduling algorithm (and optional ML suggestion)

## Contents
- `src/` — frontend React + TypeScript app (Vite)
- `src/logic/` — scheduling algorithms and feedback/rule engine
- `backend/` — demo Flask ML API (`ml_scheduler.py`, `api.py`)

## Run the project (development)

Prerequisites
- Node.js 16+ (use `nvm` or installer)
- Python 3.8+ (only required for the optional backend ML API)

1) Install frontend dependencies


# from project root (PowerShell)
npm install
2) Start the frontend dev server


npm run dev
Open the URL shown by the Vite server (commonly `http://localhost:5173`).

3) Build and preview production bundle (optional)

npm run build
npm run preview
## Running the backend ML demo (optional)

The backend is a small Flask demo that can recommend a scheduling algorithm. It's optional — the frontend includes a rule-based suggester by default.

Windows PowerShell recommended steps:


# 1. Create and activate a virtual environment
cd backend
python -m venv .venv
# In PowerShell
.\\.venv\\Scripts\\Activate.ps1
# (or for cmd.exe) .\\.venv\\Scripts\\activate.bat

# 2. Install Python dependencies
python -m pip install -r requirements.txt

# 3. Run the API (defaults to http://localhost:5000)
python api.py
Frontend configuration for ML API
- To have the frontend call the local backend during development, set `VITE_API_BASE`.

Temporary (current PowerShell session):


$env:VITE_API_BASE = 'http://localhost:5000'
npm run dev
Persistent for your user (Windows):


setx VITE_API_BASE "http://localhost:5000"
# restart your terminal so the env var is available to Vite
## Behavior notes and troubleshooting
- The app has two suggestion systems:
	- A rule-based evaluator in `src/logic/feedbackSystem.ts` which inspects process bursts, priorities and arrival patterns and recommends an algorithm (used in UI feedback).
	- An optional ML-based suggestion via `backend/api.py` that calls `ml_scheduler.py` when you enable "Let ML suggest the best algorithm".

- Why you previously saw always-`Priority` suggestions:
	- Earlier logic considered any difference in priority values as a reason to recommend `Priority`. Because the UI's random generator assigns random priorities by default, that produced `Priority` almost every time. The rule engine has been updated to consider priority *significance* (distinct count, range and variance) together with burst and arrival statistics so suggestions are more meaningful.

- If suggestions still don't match expectations:
	- Generate processes with controlled values, or
	- Temporarily modify the generator or add a UI toggle to produce processes with identical priorities.

## Development tips
- Confirm available npm scripts (`dev`, `build`, `preview`) in `package.json` before running.
- Add unit tests for `evaluateSimulation` (recommended) to lock expected suggestions.
- Tune thresholds in `src/logic/feedbackSystem.ts` if you need domain-specific behavior.

## Contributing
- Improve the ML labeling logic in `backend/ml_scheduler.py` if you plan to train a real model — currently it's a demo heuristic.
- Add tests under a `tests/` folder and add a test runner.

## License
- This repository does not include a license file by default. Add one if you plan to set open-source terms.

If you'd like, I can also:
- Add a small unit-test suite for the evaluator
- Add a UI checkbox to `generateRandomProcesses` to disable random priorities
- Improve the backend ML labeling to choose the algorithm used by simulation (instead of the current demo heuristics)

## How can I edit this code?

There are several ways of editing your application.


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

s# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Machine Learning Scheduling Module

This project now includes a Machine Learning module to recommend the best CPU scheduling algorithm for a given set of processes.

### How to use

1. In the web UI, check the box "Let ML suggest the best algorithm" in the Simulation Controls panel.
2. When you start the simulation, the backend will use the ML model to recommend the most suitable scheduling algorithm based on your process data.
3. The recommended algorithm will be shown in the results panel.

### Backend API

- The backend exposes `/api/suggest-algorithm` (POST) for ML-based recommendations.
- The ML module is implemented in `backend/ml_scheduler.py` and `backend/api.py`.

### Running the Backend

1. Install Python dependencies:
	
s	cd backend
	pip install -r requirements.txt
	2. Start the Flask API server:
	
s	python api.py
	3. Ensure your frontend is configured to call the backend at the correct address (default: `http://localhost:5000`).

### Frontend configuration (dev)

- The frontend can use the environment variable `VITE_API_BASE` to change the backend base URL used by the ML call. Example:


# from project root
setx VITE_API_BASE "http://localhost:5000"
npm run dev
If `VITE_API_BASE` is not set the app will default to `http://localhost:5000`.

### CORS

The backend enables CORS so the frontend development server (different origin/port) can call the API.

### Additional Dependencies

- Python 3.8+
- Flask
- scikit-learn
- numpy

See `backend/requirements.txt` for details.


