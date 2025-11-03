import { useState } from 'react';
import { Process } from '@/types/process';
import { SchedulingResult } from '@/types/process';
import ProcessTable from '@/components/ProcessTable';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import MemoryVisualizer from '@/components/MemoryVisualizer';
import GanttChart from '@/components/GanttChart';
import FeedbackPanel from '@/components/FeedbackPanel';
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
import { toast } from 'sonner';

const PROCESS_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
  '#10b981', '#06b6d4', '#ef4444', '#6366f1'
];

const Index = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>(initializeMemory());
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('FCFS');
  const [memoryMode, setMemoryMode] = useState<string>('firstFit');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [schedulingResult, setSchedulingResult] = useState<SchedulingResult | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [optimalAlgorithm, setOptimalAlgorithm] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);

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

  const runSimulation = () => {
    if (processes.length === 0) {
      toast.error('Please generate processes first!');
      return;
    }

    setIsSimulating(true);
    toast.info('Starting simulation...');

    // Allocate memory
    const memorySuccess = allocateMemory(processes);
    if (!memorySuccess) {
      setIsSimulating(false);
      return;
    }

    // Run scheduling algorithm
    let result: SchedulingResult;
    const processCopies = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

    switch (selectedAlgorithm) {
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
      selectedAlgorithm,
      memoryMode
    );

    setScore(prev => prev + evaluation.score);
    setFeedback(evaluation.feedback);
    setOptimalAlgorithm(evaluation.optimalAlgorithm);

    setTimeout(() => {
      setIsSimulating(false);
      toast.success('Simulation completed!', {
        description: `Score: +${evaluation.score} points`
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
          <div className="lg:col-span-3">
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
            />
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

          {/* Feedback Panel */}
          {schedulingResult && (
            <FeedbackPanel
              result={schedulingResult}
              score={score}
              feedback={feedback}
              optimalAlgorithm={optimalAlgorithm}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
