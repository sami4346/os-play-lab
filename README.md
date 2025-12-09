# Smart OS Simulator (os-play-lab)

A learning and playground app that simulates CPU scheduling and memory management.

## 🔧 Features

- Visual process table, Gantt chart, and memory layout visualizer  
- Supports CPU scheduling algorithms: `FCFS`, `SJF`, `SRJF`, `RR`, `Priority`, `RR+Priority`  
- Memory allocation methods: `firstFit`, `bestFit`, `worstFit`, manual assignment, plus optional compaction  
- Optional ML-based recommender to suggest a good scheduling algorithm, based on your process data  

---

## 🛠️ Getting Started (Development)

### Prerequisites
- Node.js (version 16 or above)  
- npm (comes with Node)  
- If you want ML suggestions: Python 3.8+  

### Run the frontend

```bash
npm install
npm run dev
```

Then open the displayed URL in your browser (commonly `http://localhost:5173`).

### (Optional) Run the backend ML API

If you want to enable ML-based suggestions:

```bash
cd backend
python -m venv .venv
# On Windows PowerShell:
.\\.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
python api.py
```

This will run the backend server (default: `http://localhost:5000`).  
To make the frontend call it during development, set an environment variable:

- In PowerShell:  
  ```powershell
  $env:VITE_API_BASE = "http://localhost:5000"
  npm run dev
  ```
- (Alternatively, set this variable globally for your user — then restart your terminal.)

---

## ✅ What’s Included

- `src/`: React + TypeScript frontend code  
- `backend/`: Optional Flask-based ML API for scheduling recommendations  

---

## 🧪 Optional Enhancements (for maintainers)

- Add unit tests (especially for scheduling logic and feedback system)  
- Improve ML-based recommendation logic (in `backend/ml_scheduler.py`) if you want a smarter/more real-world model  

---

## 📄 License & Contributing

This project has no license file by default.  
If you plan to share or open-source it, consider adding a license (e.g. MIT, GPL, Apache).  
Feel free to fork, contribute improvements or add missing features.

