import { useState } from 'react';
import { Process } from '@/types/process';
import { SchedulingResult } from '@/types/process';
import ProcessTable from '@/components/ProcessTable';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import MemoryVisualizer from '@/components/MemoryVisualizer';
import GanttChart from '@/components/GanttChart';
import FeedbackPanel from '@/components/FeedbackPanel';
import ComparativeAnalysis from '@/components/ComparativeAnalysis';
import ProcessStateVisualizer from '@/components/ProcessStateVisualizer';
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-hero border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-0.5">
                OS Process Scheduler
              </h1>
              <p className="text-white/90 text-xs sm:text-sm drop-shadow-md">
                Learn CPU scheduling & memory management interactively
              </p>
            </div>
            <Scoreboard score={score} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">Configure & Run Simulation</h2>
          <p className="text-sm text-muted-foreground">Set up processes, select an algorithm, and watch the scheduler in action</p>
        </div>

        {/* Main Grid Layout - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Left Column - Algorithm Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Algorithm Selector Card */}
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
            <div className="p-4 sm:p-5 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <button
                className="w-full flex items-center justify-between p-1 hover:bg-muted/30 rounded transition-colors"
                onClick={() => setShowManualForm(prev => !prev)}
              >
                <h4 className="font-semibold text-sm sm:text-base text-foreground">Add Custom Process</h4>
                <span className="text-lg text-muted-foreground leading-none">{showManualForm ? '−' : '+'}</span>
              </button>

              {showManualForm && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">PID</label>
                      <input 
                        className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                        placeholder="Optional" 
                        value={manualPid} 
                        onChange={e => setManualPid(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">Arrival (s)</label>
                      <input 
                        className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                        type="number" 
                        min={0} 
                        value={manualArrival} 
                        onChange={e => setManualArrival(Number(e.target.value))} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">Burst (s)</label>
                      <input 
                        className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                        type="number" 
                        min={1} 
                        value={manualBurst} 
                        onChange={e => setManualBurst(Number(e.target.value))} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">Priority</label>
                      <input 
                        className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                        type="number" 
                        min={0} 
                        value={manualPriority} 
                        onChange={e => setManualPriority(Number(e.target.value))} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">Memory (MB)</label>
                      <input 
                        className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                        type="number" 
                        min={1} 
                        value={manualMemory} 
                        onChange={e => setManualMemory(Number(e.target.value))} 
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors text-sm" 
                      onClick={addManualProcess}
                    >
                      Add Process
                    </button>
                    <button 
                      className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors text-sm font-medium" 
                      onClick={() => setShowManualForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Guide */}
            <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-sm">Quick Start</h4>
              <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
                <li>Generate or add processes</li>
                <li>Pick a scheduling algorithm</li>
                <li>Choose memory strategy</li>
                <li>Click "Start Simulation"</li>
                <li>Review results below</li>
              </ol>
            </div>
          </div>

          {/* Middle Column - Process Table */}
          <div className="md:col-span-1 lg:col-span-1">
            <ProcessTable processes={processes} />
          </div>

          {/* Right Column - Memory Visualizer */}
          <div className="md:col-span-1 lg:col-span-1">
            <MemoryVisualizer
              memoryBlocks={memoryBlocks}
              onCompact={handleCompactMemory}
              fragmentation={fragmentation}
            />
          </div>
        </div>

        {/* Results Section - Conditional */}
        {schedulingResult && (
          <div className="space-y-6 pt-8 border-t border-border">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">Simulation Results</h2>
              <p className="text-sm text-muted-foreground">Review the scheduling and memory allocation results</p>
            </div>
            
            {/* Process State Visualizer */}
            <ProcessStateVisualizer 
              processes={processes}
              ganttChart={schedulingResult?.ganttChart || []}
              isSimulating={isSimulating}
            />

            {/* Gantt Chart */}
            <GanttChart ganttChart={schedulingResult?.ganttChart || []} />

            {/* Comparative Analysis */}
            {comparativeMetrics.length > 0 && (
              <ComparativeAnalysis
                metrics={comparativeMetrics}
                selectedAlgorithm={selectedAlgorithm}
                optimalAlgorithm={optimalAlgorithm}
              />
            )}

            {/* Feedback Panel */}
            <FeedbackPanel
              result={schedulingResult}
              score={score}
              feedback={feedback}
              optimalAlgorithm={optimalAlgorithm}
              mlRecommendedAlgorithm={mlRecommendedAlgorithm}
              useMLSuggestion={useMLSuggestion}
            />
          </div>
        )}

        {/* Empty State */}
        {!schedulingResult && processes.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <div className="rounded-lg border-2 border-dashed border-border/50 p-8 sm:p-12 text-center bg-muted/20">
              <div className="mb-3 text-3xl sm:text-4xl">▶</div>
              <h3 className="font-semibold text-foreground mb-2">Ready to Simulate</h3>
              <p className="text-sm text-muted-foreground">Select an algorithm above and click "Start Simulation" to see the scheduling in action</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
