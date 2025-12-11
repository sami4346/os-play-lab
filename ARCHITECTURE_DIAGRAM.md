# Process State Visualization - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        OS SIMULATOR                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      User Interface                         │ │
│  │                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │   Process    │  │  Algorithm   │  │     Memory      │  │ │
│  │  │    Table     │  │   Selector   │  │   Visualizer    │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Simulation Engine                        │ │
│  │                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │     CPU      │  │    Memory    │  │   Feedback      │  │ │
│  │  │  Algorithms  │  │   Manager    │  │    System       │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Visualization Layer                       │ │
│  │                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │    Gantt     │  │   Process    │  │  Comparative    │  │ │
│  │  │    Chart     │  │    State     │  │   Analysis      │  │ │
│  │  │              │  │  Visualizer  │  │                 │  │ │
│  │  │              │  │  ⭐ ⏳ ⚡ ⏸️ ✓  │  │                 │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘  │ │
│  │                         NEW!                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌────────────────────────────────────────────────────────────────┐
│              ProcessStateVisualizer Component                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Props Input:                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ • processes: Process[]                                 │    │
│  │ • ganttChart: GanttChartItem[]                        │    │
│  │ • currentTime?: number                                │    │
│  │ • isSimulating?: boolean                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                         ↓                                       │
│  State Management:                                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ useState<ProcessState[]>(processStates)               │    │
│  │ useState<number>(animationTime)                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                         ↓                                       │
│  Effects (useEffect):                                           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 1. Initialize states based on processes               │    │
│  │ 2. Start animation when simulation completes          │    │
│  │ 3. Update states based on animation time              │    │
│  └────────────────────────────────────────────────────────┘    │
│                         ↓                                       │
│  Rendering:                                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                                                        │    │
│  │  Desktop Layout (md:grid-cols-5):                     │    │
│  │  ┌─────┐ → ┌─────┐ ↔ ┌─────┐                         │    │
│  │  │ New │ → │Ready│ ↔ │ Run │                         │    │
│  │  └─────┘   └─────┘   └─────┘                         │    │
│  │                                                        │    │
│  │  ┌─────┐   ┌─────┐                                   │    │
│  │  │Wait │   │Term.│                                   │    │
│  │  └─────┘   └─────┘                                   │    │
│  │                                                        │    │
│  │  Mobile Layout (vertical):                            │    │
│  │  ┌─────┐                                              │    │
│  │  │ New │                                              │    │
│  │  └─────┘                                              │    │
│  │     ↓                                                 │    │
│  │  ┌─────┐                                              │    │
│  │  │Ready│                                              │    │
│  │  └─────┘                                              │    │
│  │     ↕                                                 │    │
│  │  ┌─────┐                                              │    │
│  │  │ Run │                                              │    │
│  │  └─────┘                                              │    │
│  │                                                        │    │
│  │  Legend at bottom                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Data Flow                                │
└─────────────────────────────────────────────────────────────────┘

User Action: "Start Simulation"
        ↓
┌──────────────────┐
│  Index.tsx       │
│  runSimulation() │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ cpuAlgorithms.ts │  ← Calculates schedule
│ fcfs/sjf/rr/etc  │
└────────┬─────────┘
         ↓
┌────────────────────────────────┐
│  Returns SchedulingResult:     │
│  • ganttChart: GanttChartItem[]│
│  • processes: Process[]        │
│  • metrics: ...                │
└────────┬───────────────────────┘
         ↓
┌──────────────────────────────┐
│ Index.tsx                    │
│ setSchedulingResult(result)  │
│ setProcesses(updated)        │
│ setIsSimulating(false)       │
└────────┬─────────────────────┘
         ↓
┌────────────────────────────────────┐
│ ProcessStateVisualizer (renders)  │
│ Receives:                          │
│ • processes (with colors, times)   │
│ • ganttChart (execution timeline)  │
│ • isSimulating = false             │
└────────┬───────────────────────────┘
         ↓
┌──────────────────────────────┐
│ Animation Engine Starts      │
│ • 50ms interval              │
│ • 3 second duration          │
│ • Updates animationTime      │
└────────┬─────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ State Calculation (each frame)       │
│ For each process:                    │
│   if arrivalTime <= time → Ready     │
│   if in ganttChart item → Running    │
│   if completed → Terminated          │
└────────┬─────────────────────────────┘
         ↓
┌──────────────────────────────┐
│ UI Updates                   │
│ • Process badges move        │
│ • State boxes update counts  │
│ • Smooth animations play     │
└──────────────────────────────┘
```

## State Calculation Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│            State Calculation Flowchart                       │
└─────────────────────────────────────────────────────────────┘

For each process at time T:

START
  ↓
┌─────────────────────┐
│ arrivalTime > T?    │ YES → Status = NEW
└────┬────────────────┘
     │ NO
     ↓
┌─────────────────────┐
│ Check ganttChart:   │
│ Is process in any   │
│ item where          │
│ startTime <= T      │
│ AND endTime > T?    │
└────┬────────────────┘
     │
     ├─ YES → Status = RUNNING
     │
     └─ NO ↓
        ┌─────────────────────┐
        │ Check if all        │
        │ ganttChart items    │
        │ for this process    │
        │ have endTime <= T   │
        └────┬────────────────┘
             │
             ├─ YES → Status = TERMINATED
             │
             └─ NO → Status = READY

END

Note: WAITING state is reserved for future I/O simulation
```

## Animation Timeline

```
┌─────────────────────────────────────────────────────────────┐
│                   Animation Timeline                         │
└─────────────────────────────────────────────────────────────┘

Simulation completes at actual time T (e.g., 15 seconds)

Animation plays over 3 seconds:

Real Time:  0s    0.5s   1.0s   1.5s   2.0s   2.5s   3.0s
            │      │      │      │      │      │      │
Sim Time:   0s     3s     6s     9s    12s    15s    15s
            │      │      │      │      │      │      │
Frame:      0     10     20     30     40     50     60
            │      │      │      │      │      │      │
Update:    50ms   50ms   50ms   50ms   50ms   50ms  END
            ↓      ↓      ↓      ↓      ↓      ↓      ↓
States:   [NEW]  [RDY]  [RUN]  [RUN]  [RUN]  [TRM]  [TRM]
          [NEW]  [RDY]  [RDY]  [RDY]  [RUN]  [RUN]  [TRM]
          [NEW]  [NEW]  [RDY]  [RDY]  [RDY]  [RUN]  [TRM]

Each frame (50ms), calculate which state each process should be in
based on the simulation time (0 to T) mapped to animation time (0 to 3s)
```

## Component Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│              Component Lifecycle                             │
└─────────────────────────────────────────────────────────────┘

1. MOUNT
   ↓
   Component renders with empty state
   ↓

2. PROPS RECEIVED (processes, ganttChart)
   ↓
   useEffect #1 triggers
   ↓
   Calculate initial states
   ↓
   Render state boxes with processes
   ↓

3. SIMULATION COMPLETES
   ↓
   isSimulating changes: true → false
   ↓
   useEffect #2 triggers
   ↓
   Start animation interval (50ms)
   ↓
   animationTime increments each frame
   ↓

4. ANIMATION RUNNING
   ↓
   useEffect #3 triggers on each animationTime change
   ↓
   Calculate states for current time
   ↓
   Update processStates
   ↓
   UI re-renders with new states
   ↓
   (repeat until animationTime >= maxTime)
   ↓

5. ANIMATION COMPLETE
   ↓
   Interval clears itself
   ↓
   Final state displayed (all Terminated)
   ↓

6. UNMOUNT (optional)
   ↓
   Cleanup: clear any remaining intervals
   ↓
   Component removed from DOM
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│           Integration with Existing System                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   ProcessTable      │ ← Shows process list
└──────────┬──────────┘
           │
           ↓ (user input)
┌─────────────────────┐
│  AlgorithmSelector  │ ← User selects algorithm
└──────────┬──────────┘
           │
           ↓ (run simulation)
┌─────────────────────┐
│  cpuAlgorithms.ts   │ ← Executes scheduling
└──────────┬──────────┘
           │
           ├─→ [GanttChart] ← Timeline view
           │
           ├─→ [ProcessStateVisualizer] ← NEW! State view
           │
           ├─→ [ComparativeAnalysis] ← Performance metrics
           │
           └─→ [FeedbackPanel] ← Recommendations

All components receive data from same simulation result
ProcessStateVisualizer specifically uses:
  • ganttChart for animation timing
  • processes for state tracking
```

## File Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                  File Dependencies                           │
└─────────────────────────────────────────────────────────────┘

ProcessStateVisualizer.tsx
│
├─ Imports:
│  ├─ react (useState, useEffect)
│  ├─ @/types/process (Process, GanttChartItem)
│  ├─ @/components/ui/card (Card, CardHeader, etc.)
│  └─ @/components/ui/badge (Badge)
│
├─ Used By:
│  └─ pages/Index.tsx
│
└─ Depends On:
   ├─ Process type definition
   ├─ GanttChartItem type definition
   ├─ shadcn/ui components
   └─ Tailwind CSS classes
```

## Summary

This architecture provides:

✅ **Clear Separation of Concerns**
- UI layer (ProcessStateVisualizer)
- Business logic (cpuAlgorithms)
- Data types (process.ts)

✅ **Efficient Data Flow**
- One-way data flow from parent to child
- Props-based communication
- State managed internally for animation

✅ **Scalable Design**
- Easy to add new states
- Can extend animation features
- Modular component structure

✅ **Educational Focus**
- Visual feedback at each step
- Clear state transitions
- Integrated legend for learning

---

**This architecture ensures the Process State Visualization is maintainable, 
extensible, and provides maximum educational value!**
