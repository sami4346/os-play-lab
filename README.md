# Smart OS Simulator (os-play-lab)

A learning and playground app that simulates CPU scheduling and memory management.

## 🔧 Features

### Core Features
- **Visual process table, Gantt chart, and memory layout visualizer**
- **Process State Visualization**: User-controlled animated view of the five-state process model with adjustable playback speed
  - Manual animation trigger
  - Play/Pause/Reset controls
  - Speed adjustment (0.25x to 2x)
  - Progress tracking
- **Collapsible Sidebar**: Toggle sidebar on desktop and mobile for more screen space
- Supports CPU scheduling algorithms: `FCFS`, `SJF`, `SRJF`, `RR`, `Priority`, `RR+Priority`  
- Memory allocation methods: `firstFit`, `bestFit`, `worstFit`, automatic allocation, plus optional compaction  

### Advanced Features
- **Page Replacement Algorithms** ⭐ NEW: Complete simulation of FIFO, LRU, Optimal, and Clock algorithms
  - Interactive visualization with step-by-step animation
  - Predefined patterns (random, sequential, locality, thrashing)
  - Algorithm comparison with detailed statistics
  - Educational insights about page faults and Belady's anomaly
- **Comparative Analysis**: Side-by-side algorithm performance comparison with charts
- **Advanced Metrics**: CPU utilization, throughput, response time, waiting time, turnaround time, and more
- **Smart Recommendations**: Dynamic algorithm suggestions based on process characteristics
- **Memory Fragmentation Tracking**: Visual representation of memory usage and fragmentation
- Optional ML-based recommender to suggest optimal scheduling algorithms based on your process data  
- **Educational Feedback**: Contextual insights and recommendations for learning

### 🎨 Enhanced UX (NEW!)
- **Modern Design**: Glassmorphism effects, gradients, and smooth animations
- **Enhanced Components**: Premium cards, buttons, and interactive elements
- **Loading States**: Professional spinners and skeleton screens
- **Visual Algorithm Selector**: Card-based selection with icons and descriptions
- **Better Feedback**: Smooth transitions and micro-animations

---

## 🎓 Educational Value

This simulator is designed for:
- **Students** learning Operating System concepts
- **Educators** teaching CPU scheduling and memory management
- **Enthusiasts** exploring OS algorithms interactively

### What You'll Learn:
✅ How different scheduling algorithms perform under various workloads  
✅ Process state transitions (five-state model) with controllable animation  
✅ Memory allocation strategies and fragmentation  
✅ **Page replacement algorithms (FIFO, LRU, Optimal, Clock)** ⭐ NEW
✅ **Virtual memory concepts, page faults, and Belady's anomaly** ⭐ NEW
✅ Performance metrics and trade-offs  
✅ Real-time visualization of OS concepts  

---

## 🛠️ Getting Started (Development)

### Prerequisites
- Node.js (version 16 or above)  
- npm (comes with Node)  
- If you want ML suggestions: Python 3.8+  

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Then open the displayed URL in your browser (commonly `http://localhost:8080`).

### (Optional) Run the backend ML API

If you want to enable ML-based suggestions:

```bash
cd backend
python -m venv .venv
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

**Note**: The Gemini AI API has free tier limits. If you exceed the quota, the chat feature will automatically fall back to a local knowledge base. For unlimited usage, consider upgrading to a paid Google AI plan.

---

## 📚 Documentation

- **[PAGE_REPLACEMENT.md](PAGE_REPLACEMENT.md)**: Complete guide to Page Replacement Algorithms feature ⭐ NEW
- **[ENHANCEMENTS.md](ENHANCEMENTS.md)**: Comprehensive documentation of all features and metrics
- **[PROCESS_STATE_VISUALIZATION.md](PROCESS_STATE_VISUALIZATION.md)**: Detailed guide to the process state visualizer feature
- **[ANIMATION_CONTROLS_UPDATE.md](ANIMATION_CONTROLS_UPDATE.md)**: Guide to animation controls and speed adjustment
- **[COLLAPSIBLE_SIDEBAR.md](COLLAPSIBLE_SIDEBAR.md)**: Guide to the collapsible sidebar feature
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**: Complete implementation status and technical details
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)**: Navigation hub for all documentation

---

## ✅ What's Included

- `src/`: React + TypeScript frontend code  
  - `components/`: UI components including ProcessStateVisualizer and Navigation
  - `logic/`: CPU scheduling algorithms, memory management, metrics calculation
  - `types/`: TypeScript type definitions
  - `context/`: Global state management (NavContext)
- `backend/`: Optional Flask-based ML API for scheduling recommendations  

---

## 🎮 How to Use

### CPU Scheduling & Memory Management (Home Page)
1. **Generate Processes**: Click "Generate Random Processes" or add custom processes
2. **Toggle Sidebar**: Click the chevron button (desktop) or hamburger menu (mobile) to collapse/expand sidebar for more space
3. **Select Algorithm**: Choose a CPU scheduling algorithm (or let ML suggest one)
4. **Choose Memory Mode**: Select First Fit, Best Fit, or Worst Fit
5. **Run Simulation**: Click "Start Simulation" to see the results
6. **Analyze Results**: 
   - Click **"Show State Transitions"** to view the animated **Process State Diagram**
   - Use **animation controls** (play/pause, speed adjustment)
   - Study the **Gantt Chart** timeline
   - Compare algorithms in the **Comparative Analysis** section
   - Review **Performance Metrics** and recommendations
7. **Optimize**: Try different algorithms and memory strategies to maximize your score!

### Page Replacement Algorithms ⭐ NEW
1. **Access Feature**: Click "Page Replacement" in the sidebar (or press Ctrl+P)
2. **Set Reference String**: 
   - Enter custom page numbers (e.g., "7, 0, 1, 2, 0, 3")
   - Generate random or locality patterns
   - Choose from predefined educational patterns
3. **Configure Frames**: Use slider to set number of page frames (1-10)
4. **Select Algorithm**: Choose FIFO, LRU, Optimal, or Clock
5. **Run Simulation**: Watch step-by-step animation of page replacements
6. **Control Animation**: Play/pause, step forward/backward, adjust speed
7. **Compare Algorithms**: Run all algorithms to see performance differences
8. **Learn**: Read insights about page faults, hits, and algorithm trade-offs

See **[PAGE_REPLACEMENT.md](PAGE_REPLACEMENT.md)** for detailed usage guide.

---

## 🆕 Recent Additions

### Page Replacement Algorithms ⭐ NEW
- **Complete Implementation**: FIFO, LRU, Optimal, and Clock algorithms
- **Interactive Visualization**: Step-by-step animation with playback controls
- **Educational Patterns**: 7 predefined patterns demonstrating key concepts
- **Algorithm Comparison**: Side-by-side performance analysis
- **Detailed Statistics**: Page faults, hits, charts, and insights
- **Keyboard Shortcut**: Press Ctrl+P to access

See **[PAGE_REPLACEMENT.md](PAGE_REPLACEMENT.md)** for complete documentation.

### Animation Controls for Process State Visualization
- **Manual Trigger**: Click "Show State Transitions" button to start
- **Play/Pause Controls**: Full control over animation playback
- **Speed Adjustment**: Slider to adjust speed from 0.25x (slow) to 2x (fast)
- **Progress Tracking**: Visual progress bar and time counter
- **Better Learning**: Slow down to observe details, pause at critical moments

See **[ANIMATION_CONTROLS_UPDATE.md](ANIMATION_CONTROLS_UPDATE.md)** for detailed documentation.

### Collapsible Sidebar
- **Desktop**: Toggle button to expand/collapse sidebar
  - Expanded: Full navigation with text
  - Collapsed: Icon-only mode with tooltips
- **Mobile**: Hamburger menu with slide-in sidebar
- **Persistent**: Remembers your preference
- **Smooth**: Animated transitions

See **[COLLAPSIBLE_SIDEBAR.md](COLLAPSIBLE_SIDEBAR.md)** for detailed documentation.

### Process State Visualization
- Real-time animated visualization of process states
- User-controlled playback with adjustable speed
- Educational legend explaining state transitions
- Responsive design (horizontal on desktop, vertical on mobile)
- Color-coded states with intuitive emoji icons

See **[PROCESS_STATE_VISUALIZATION.md](PROCESS_STATE_VISUALIZATION.md)** for detailed documentation.

---

## 🧪 Optional Enhancements (for maintainers)

- Add unit tests (especially for scheduling logic and feedback system)  
- Improve ML-based recommendation logic (in `backend/ml_scheduler.py`) if you want a smarter/more real-world model  
- Add I/O simulation to demonstrate the Waiting state
- Implement multi-core CPU simulation
- Add export functionality for Gantt charts and state diagrams
- Add step-by-step mode for animation
- Add seek bar for animation navigation

---

## 🤝 Contributing

We welcome contributions! Some ideas:
- Bug fixes and optimizations
- Additional scheduling algorithms (e.g., Multilevel Queue, Aging)
- Enhanced visualizations
- I/O operation simulation
- Unit and integration tests
- Documentation improvements
- UI/UX enhancements
- Animation features (step mode, bookmarks, export)

---

## 📄 License

This project has no license file by default.  
If you plan to share or open-source it, consider adding a license (e.g. MIT, GPL, Apache).  
Feel free to fork, contribute improvements or add missing features.

---

## 🏆 Credits

Built with:
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Recharts for visualizations
- Lucide React for icons
- Python + Flask (optional ML backend)

---

