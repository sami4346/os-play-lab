import { useState } from 'react';
import { Process } from '@/types/process';
import { SchedulingResult } from '@/types/process';
import ProcessTable from '@/components/ProcessTable';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import MemoryVisualizer from '@/components/MemoryVisualizer';
import GanttChart from '@/components/GanttChart';
import FeedbackPanel from '@/components/FeedbackPanel';
import ComparativeAnalysis from '@/components/ComparativeAnalysis';
import Scoreboard from '@/components/Scoreboard';
import { fcfs, sjf, srjf, roundRobin, priorityScheduling, rrWithPriority } from '@/logic/cpuAlgorithms';
import { 
  initializeMemory, 
  firstFit, 
  bestFit, 
  worstFit,
  compactMemory,
  calculateFragmentation,
  MemoryBlock
} from '@/logic/memoryManager';
import { evaluateSimulation } from '@/logic/feedbackSystem';
import { AlgorithmMetrics } from '@/types/process';
import { toast } from 'sonner';

const PROCESS_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
  '#10b981', '#06b6d4', '#ef4444', '#6366f1'
];

const Index = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [showManualForm, setShowManualForm] = useState<boolean>(false);
  const [manualPid, setManualPid] = useState<string>('');
  const [manualArrival, setManualArrival] = useState<number>(0);
  const [manualBurst, setManualBurst] = useState<number>(2);
  const [manualPriority, setManualPriority] = useState<number>(1);
  const [manualMemory, setManualMemory] = useState<number>(64);
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>(initializeMemory());
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('FCFS');
  const [memoryMode, setMemoryMode] = useState<string>('firstFit');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [schedulingResult, setSchedulingResult] = useState<SchedulingResult | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [optimalAlgorithm, setOptimalAlgorithm] = useState<string>('');
  const [comparativeMetrics, setComparativeMetrics] = useState<AlgorithmMetrics[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [useMLSuggestion, setUseMLSuggestion] = useState<boolean>(false);
  const [mlRecommendedAlgorithm, setMLRecommendedAlgorithm] = useState<string>('');

  const generateRandomProcesses = () => {
    const count = Math.floor(Math.random() * 3) + 4; // 4-6 processes
    const newProcesses: Process[] = [];

    for (let i = 0; i < count; i++) {
      newProcesses.push({
        pid: `P${i + 1}`,
        arrivalTime: Math.floor(Math.random() * 10),
        burstTime: Math.floor(Math.random() * 10) + 2,
        priority: Math.floor(Math.random() * 5) + 1,
        memoryRequired: Math.floor(Math.random() * 150) + 50,
        status: 'waiting',
        color: PROCESS_COLORS[i % PROCESS_COLORS.length]
      });
    }

    setProcesses(newProcesses);
    setMemoryBlocks(initializeMemory());
    setSchedulingResult(null);
    setFeedback([]);
    toast.success(`Generated ${count} random processes!`);
  };

  const addManualProcess = () => {
    // basic validation
    if (manualBurst <= 0 || manualPriority < 0 || manualMemory <= 0) {
      toast.error('Please provide valid numeric values for burst, priority and memory.');
      return;
    }

    // create PID if not provided
    const existingPids = new Set(processes.map(p => p.pid));
    let pid = manualPid && manualPid.trim() !== '' ? manualPid.trim() : `P${processes.length + 1}`;
    let suffix = 1;
    while (existingPids.has(pid)) {
      pid = `${pid}-${suffix}`;
      suffix++;
    }

    const color = PROCESS_COLORS[processes.length % PROCESS_COLORS.length];

    const newProc: Process = {
      pid,
      arrivalTime: Math.max(0, Math.floor(manualArrival)),
      burstTime: Math.max(1, Math.floor(manualBurst)),
      priority: Math.max(0, Math.floor(manualPriority)),
      memoryRequired: Math.max(1, Math.floor(manualMemory)),
      status: 'waiting',
      color
    };

    setProcesses(prev => [...prev, newProc]);
    setSchedulingResult(null);
    setFeedback([]);
    setShowManualForm(false);
    setManualPid('');
    setManualArrival(0);
    setManualBurst(2);
    setManualPriority(1);
    setManualMemory(64);
    toast.success(`Added process ${pid}`);
  };

  const allocateMemory = (procs: Process[]): boolean => {
    let blocks = initializeMemory();
    
    for (const proc of procs) {
      let result: MemoryBlock[] | null = null;

      switch (memoryMode) {
        case 'firstFit':
          result = firstFit(blocks, proc);
          break;
        case 'bestFit':
          result = bestFit(blocks, proc);
          break;
        case 'worstFit':
          result = worstFit(blocks, proc);
          break;
        default:
          result = firstFit(blocks, proc);
      }

      if (!result) {
        toast.error(`Failed to allocate memory for ${proc.pid}`);
        return false;
      }

      blocks = result;
    }

    setMemoryBlocks(blocks);
    return true;
  };

  const runSimulation = async () => {
    if (processes.length === 0) {
      toast.error('Please generate processes first!');
      return;
    }

    setIsSimulating(true);
    toast.info('Starting simulation...');

    // ML suggestion
    let algorithmToUse = selectedAlgorithm;
    if (useMLSuggestion) {
      try {
        // Use Vite env var `VITE_API_BASE` when provided, otherwise default to localhost:5000
        const apiBase = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:5000';
        const response = await fetch(`${apiBase}/api/suggest-algorithm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            processes: processes.map(p => ({
              burst: p.burstTime,
              priority: p.priority,
              arrival: p.arrivalTime
            }))
          })
        });
        const data = await response.json();
        if (data.suggested_algorithm) {
          algorithmToUse = data.suggested_algorithm;
          setMLRecommendedAlgorithm(data.suggested_algorithm);
          setSelectedAlgorithm(data.suggested_algorithm);
          toast.success(`ML recommends: ${data.suggested_algorithm}`);
        } else {
          toast.error('ML suggestion failed, using selected algorithm.');
        }
      } catch (err) {
        toast.error('ML API error, using selected algorithm.');
      }
    } else {
      setMLRecommendedAlgorithm('');
    }

    // Allocate memory
    const memorySuccess = allocateMemory(processes);
    if (!memorySuccess) {
      setIsSimulating(false);
      return;
    }

    // Run scheduling algorithm
    let result: SchedulingResult;
    const processCopies = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

    switch (algorithmToUse) {
      case 'FCFS':
        result = fcfs(processCopies);
        break;
      case 'SJF':
        result = sjf(processCopies);
        break;
      case 'SRJF':
        result = srjf(processCopies);
        break;
      case 'RR':
        result = roundRobin(processCopies, timeQuantum);
        break;
      case 'Priority':
        result = priorityScheduling(processCopies);
        break;
      case 'RR+Priority':
        result = rrWithPriority(processCopies, timeQuantum);
        break;
      default:
        result = fcfs(processCopies);
    }

    // Update process statuses
    const updatedProcesses = result.processes.map(p => ({
      ...p,
      status: 'completed' as const
    }));

    setProcesses(updatedProcesses);
    setSchedulingResult(result);

    // Evaluate and provide feedback
    const evaluation = evaluateSimulation(
      updatedProcesses,
      result,
      memoryBlocks,
      algorithmToUse,
      memoryMode,
      timeQuantum
    );

    // Only award points if the player selected the optimal algorithm
    if (evaluation.optimalAlgorithm && evaluation.optimalAlgorithm === algorithmToUse) {
      setScore(prev => prev + evaluation.score);
    }
    setFeedback(evaluation.feedback);
    setOptimalAlgorithm(evaluation.optimalAlgorithm);
    if (evaluation.comparativeMetrics) {
      setComparativeMetrics(evaluation.comparativeMetrics);
    }

    setTimeout(() => {
      setIsSimulating(false);
      const pointsAwarded = (evaluation.optimalAlgorithm === algorithmToUse) ? evaluation.score : 0;
      toast.success('Simulation completed!', {
        description: `Score: +${pointsAwarded} points`
      });
    }, 1000);
  };

  const handleCompactMemory = () => {
    const compacted = compactMemory(memoryBlocks);
    setMemoryBlocks(compacted);
    setScore(prev => prev + 5);
    toast.success('Memory compacted successfully! +5 points');
  };

  const handleReset = () => {
    setProcesses([]);
    setMemoryBlocks(initializeMemory());
    setSchedulingResult(null);
    setFeedback([]);
    setComparativeMetrics([]);
    setScore(0);
    toast.info('Simulation reset');
  };

  const fragmentation = calculateFragmentation(memoryBlocks);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero border-b border-border shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground mb-1">
                Smart OS Simulator
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                A Game-Based Approach to CPU Scheduling and Memory Management
              </p>
            </div>
            <Scoreboard score={score} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Top Section - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Process Table - Left */}
          <div className="lg:col-span-5">
            <ProcessTable processes={processes} />
          </div>

          {/* Algorithm Selector - Middle */}
          <div className="lg:col-span-3 space-y-6">
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              memoryMode={memoryMode}
              onMemoryModeChange={setMemoryMode}
              timeQuantum={timeQuantum}
              onTimeQuantumChange={setTimeQuantum}
              onStartSimulation={runSimulation}
              onReset={handleReset}
              onGenerateProcesses={generateRandomProcesses}
              isSimulating={isSimulating}
              useMLSuggestion={useMLSuggestion}
              onMLSuggestionChange={setUseMLSuggestion}
            />
            {/* Manual Process Creator */}
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Add Custom Process</h4>
                <button
                  className="text-sm text-primary underline"
                  onClick={() => setShowManualForm(prev => !prev)}
                >
                  {showManualForm ? 'Close' : 'Open'}
                </button>
              </div>

              {showManualForm && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input className="p-2 border rounded" placeholder="PID (optional)" value={manualPid} onChange={e => setManualPid(e.target.value)} />
                    <input className="p-2 border rounded" type="number" min={0} value={manualArrival} onChange={e => setManualArrival(Number(e.target.value))} placeholder="Arrival" />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input className="p-2 border rounded" type="number" min={1} value={manualBurst} onChange={e => setManualBurst(Number(e.target.value))} placeholder="Burst" />
                    <input className="p-2 border rounded" type="number" min={0} value={manualPriority} onChange={e => setManualPriority(Number(e.target.value))} placeholder="Priority" />
                    <input className="p-2 border rounded" type="number" min={1} value={manualMemory} onChange={e => setManualMemory(Number(e.target.value))} placeholder="Memory (MB)" />
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-2 bg-primary text-white rounded" onClick={addManualProcess}>Add Process</button>
                    <button className="px-3 py-2 border rounded" onClick={() => setShowManualForm(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
            {/* User manual / How to Play card */}
            <div>
              {/* Lazy import component to keep file small; simple inlined manual here */}
              <div className="p-6 shadow-elegant border border-border rounded-lg bg-card">
                <h3 className="font-semibold text-lg mb-2">How to Play</h3>
                <ol className="text-sm list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Generate random processes or add your own in the Process Table.</li>
                  <li>Choose a CPU scheduling algorithm (or let ML suggest one).</li>
                  <li>Pick a memory allocation mode (First Fit / Best Fit / Worst Fit).</li>
                  <li>Click <strong>Start Simulation</strong>. The simulator will run and show the Gantt chart and metrics.</li>
                  <li>If your selected algorithm matches the evaluator's optimal suggestion, you earn points.</li>
                  <li>Manage memory: compact to reduce fragmentation and earn bonus points.</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-3">Tip: Use Round Robin for fairness, SJF/SRJF for short bursts, and Priority when priorities are significant.</p>
              </div>
            </div>
          </div>

          {/* Memory Visualizer - Right */}
          <div className="lg:col-span-4">
            <MemoryVisualizer
              memoryBlocks={memoryBlocks}
              onCompact={handleCompactMemory}
              fragmentation={fragmentation}
            />
          </div>
        </div>

        {/* Bottom Section - Full Width */}
        <div className="space-y-6">
          {/* Gantt Chart */}
          <GanttChart ganttChart={schedulingResult?.ganttChart || []} />

          {/* Comparative Analysis */}
          {schedulingResult && comparativeMetrics.length > 0 && (
            <ComparativeAnalysis
              metrics={comparativeMetrics}
              selectedAlgorithm={selectedAlgorithm}
              optimalAlgorithm={optimalAlgorithm}
            />
          )}

          {/* Feedback Panel */}
          {schedulingResult && (
            <FeedbackPanel
              result={schedulingResult}
              score={score}
              feedback={feedback}
              optimalAlgorithm={optimalAlgorithm}
              mlRecommendedAlgorithm={mlRecommendedAlgorithm}
              useMLSuggestion={useMLSuggestion}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
