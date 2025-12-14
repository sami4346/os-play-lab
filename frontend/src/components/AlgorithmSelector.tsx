import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Play, RotateCcw, Zap, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AlgorithmSelectorProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (algorithm: string) => void;
  memoryMode: string;
  onMemoryModeChange: (mode: string) => void;
  timeQuantum: number;
  onTimeQuantumChange: (quantum: number) => void;
  onStartSimulation: () => void;
  onReset: () => void;
  onGenerateProcesses: () => void;
  isSimulating: boolean;
  useMLSuggestion: boolean;
  onMLSuggestionChange: (useML: boolean) => void;
}

const AlgorithmSelector = ({
  selectedAlgorithm,
  onAlgorithmChange,
  memoryMode,
  onMemoryModeChange,
  timeQuantum,
  onTimeQuantumChange,
  onStartSimulation,
  onReset,
  onGenerateProcesses,
  isSimulating,
  useMLSuggestion,
  onMLSuggestionChange
}: AlgorithmSelectorProps) => {
  const algorithmDescriptions: Record<string, { fullName: string; description: string; bestFor: string }> = {
    FCFS: {
      fullName: 'First Come First Serve',
      description: 'Processes execute in arrival order',
      bestFor: 'Simple, batch systems'
    },
    SJF: {
      fullName: 'Shortest Job First',
      description: 'Execute processes with shortest burst time first',
      bestFor: 'Minimizing average waiting time'
    },
    SRJF: {
      fullName: 'Shortest Remaining Job First',
      description: 'Preemptive version of SJF',
      bestFor: 'Interactive systems'
    },
    RR: {
      fullName: 'Round Robin',
      description: 'Each process gets equal time quantum',
      bestFor: 'Interactive, time-sharing systems'
    },
    Priority: {
      fullName: 'Priority Scheduling',
      description: 'Processes execute based on priority level',
      bestFor: 'Real-time systems'
    },
    'RR+Priority': {
      fullName: 'Round Robin + Priority',
      description: 'Combines priority levels with time quantum',
      bestFor: 'Advanced priority-based systems'
    }
  };

  const currentAlgoInfo = algorithmDescriptions[selectedAlgorithm];

  return (
    <Card className="p-5 sm:p-6 space-y-6 shadow-md border-border bg-card hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Zap className="w-5 h-5 text-primary flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">Simulation Controls</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Configure and run your simulation</p>
        </div>
        <Badge variant="outline" className="bg-primary/5">
          NEW
        </Badge>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="algorithm" className="text-sm font-semibold text-foreground flex items-center gap-2">
            CPU Scheduling Algorithm
            <span className="text-xs font-normal text-muted-foreground">(6 options)</span>
          </Label>
          <Select value={selectedAlgorithm} onValueChange={onAlgorithmChange} disabled={useMLSuggestion}>
            <SelectTrigger 
              id="algorithm" 
              className="w-full bg-background border-border hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/30"
              aria-describedby="algorithm-desc"
            >
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FCFS">
                <span className="font-medium">FCFS</span> - First Come First Serve
              </SelectItem>
              <SelectItem value="SJF">
                <span className="font-medium">SJF</span> - Shortest Job First
              </SelectItem>
              <SelectItem value="SRJF">
                <span className="font-medium">SRJF</span> - Shortest Remaining Job First
              </SelectItem>
              <SelectItem value="RR">
                <span className="font-medium">RR</span> - Round Robin
              </SelectItem>
              <SelectItem value="Priority">
                <span className="font-medium">Priority</span> - Priority Scheduling
              </SelectItem>
              <SelectItem value="RR+Priority">
                <span className="font-medium">RR+Priority</span> - Round Robin + Priority
              </SelectItem>
            </SelectContent>
          </Select>
          
          {currentAlgoInfo && !useMLSuggestion && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 animate-fade-in">
              <p className="text-xs text-muted-foreground mb-1">
                <span className="font-semibold text-foreground">{currentAlgoInfo.fullName}</span>
              </p>
              <p className="text-xs text-muted-foreground mb-2">{currentAlgoInfo.description}</p>
              <p className="text-xs text-primary font-medium">✓ Best for: {currentAlgoInfo.bestFor}</p>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200/50 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors cursor-pointer">
            <input
              type="checkbox"
              id="ml-suggest"
              checked={useMLSuggestion}
              onChange={e => onMLSuggestionChange(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-blue-600"
              disabled={isSimulating}
              aria-describedby="ml-help"
            />
            <div className="flex-1">
              <Label htmlFor="ml-suggest" className="text-sm cursor-pointer text-blue-900 dark:text-blue-100 font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Let AI suggest the best algorithm
              </Label>
              <p id="ml-help" className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                AI analyzes your processes to recommend the most efficient algorithm
              </p>
            </div>
          </div>
        </div>

        {(selectedAlgorithm === 'RR' || selectedAlgorithm === 'RR+Priority') && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border animate-slide-in">
            <Label htmlFor="quantum" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Time Quantum (seconds)
            </Label>
            <Input
              id="quantum"
              type="number"
              min="1"
              max="10"
              value={timeQuantum}
              onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 2)}
              className="w-full bg-background border-border focus:ring-2 focus:ring-accent/30"
              aria-describedby="quantum-help"
            />
            <p id="quantum-help" className="text-xs text-muted-foreground">
              How long each process runs before yielding to the next process
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="memory" className="text-sm font-semibold text-foreground">
            Memory Allocation Strategy
          </Label>
          <Select value={memoryMode} onValueChange={onMemoryModeChange}>
            <SelectTrigger 
              id="memory" 
              className="w-full bg-background border-border hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/30"
              aria-describedby="memory-desc"
            >
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firstFit">
                <span className="font-medium">First Fit</span> - Use first available space
              </SelectItem>
              <SelectItem value="bestFit">
                <span className="font-medium">Best Fit</span> - Use smallest fitting space
              </SelectItem>
              <SelectItem value="worstFit">
                <span className="font-medium">Worst Fit</span> - Use largest available space
              </SelectItem>
            </SelectContent>
          </Select>
          <p id="memory-desc" className="text-xs text-muted-foreground">
            Controls how free memory blocks are selected for process allocation
          </p>
        </div>
      </div>

      <div className="space-y-2.5 pt-5 border-t border-border">
        <Button
          onClick={onGenerateProcesses}
          variant="outline"
          className="w-full font-medium hover:bg-muted transition-colors focus:ring-2 focus:ring-primary/30"
          disabled={isSimulating}
          aria-label="Generate random processes with default parameters"
        >
          <span className="text-base">+ Generate Processes</span>
        </Button>

        <Button
          onClick={onStartSimulation}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold transition-all py-2.5 h-auto shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary/30"
          disabled={isSimulating}
          aria-label={isSimulating ? "Simulation running..." : "Start the CPU scheduling simulation"}
        >
          <Play className="w-4 h-4 mr-2" />
          <span className="text-base">{isSimulating ? 'Simulation Running...' : 'Start Simulation'}</span>
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full font-medium hover:bg-destructive/10 transition-colors focus:ring-2 focus:ring-destructive/30"
          aria-label="Reset all processes and simulation results"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          <span>Reset All</span>
        </Button>
      </div>
    </Card>
  );
};

export default AlgorithmSelector;
