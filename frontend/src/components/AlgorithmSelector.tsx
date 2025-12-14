import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Play, RotateCcw, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
  return (
    <Card className="p-5 sm:p-6 space-y-6 shadow-sm border-border bg-card">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Zap className="w-5 h-5 text-primary flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-foreground">Simulation Controls</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Configure and run your simulation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2.5">
          <Label htmlFor="algorithm" className="text-sm font-semibold text-foreground">
            CPU Scheduling Algorithm
          </Label>
          <Select value={selectedAlgorithm} onValueChange={onAlgorithmChange} disabled={useMLSuggestion}>
            <SelectTrigger id="algorithm" className="w-full bg-background border-border hover:border-border-hover transition-colors">
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
          <div className="flex items-center mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-900/50">
            <input
              type="checkbox"
              id="ml-suggest"
              checked={useMLSuggestion}
              onChange={e => onMLSuggestionChange(e.target.checked)}
              className="w-4 h-4 rounded mr-3 cursor-pointer"
              disabled={isSimulating}
            />
            <Label htmlFor="ml-suggest" className="text-sm cursor-pointer text-blue-900 dark:text-blue-100 font-medium">
              ✨ Let AI suggest the best algorithm
            </Label>
          </div>
        </div>

        {(selectedAlgorithm === 'RR' || selectedAlgorithm === 'RR+Priority') && (
          <div className="space-y-2.5 p-4 bg-muted/30 rounded-lg border border-border">
            <Label htmlFor="quantum" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Time Quantum (seconds)
            </Label>
            <Input
              id="quantum"
              type="number"
              min="1"
              max="10"
              value={timeQuantum}
              onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 2)}
              className="w-full bg-background border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">How long each process runs per turn</p>
          </div>
        )}

        <div className="space-y-2.5">
          <Label htmlFor="memory" className="text-sm font-semibold text-foreground">
            Memory Allocation Strategy
          </Label>
          <Select value={memoryMode} onValueChange={onMemoryModeChange}>
            <SelectTrigger id="memory" className="w-full bg-background border-border hover:border-border-hover transition-colors">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="firstFit">First Fit - Use first available space</SelectItem>
              <SelectItem value="bestFit">Best Fit - Use smallest fitting space</SelectItem>
              <SelectItem value="worstFit">Worst Fit - Use largest available space</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2.5 pt-4 border-t border-border">
        <Button
          onClick={onGenerateProcesses}
          variant="outline"
          className="w-full font-medium hover:bg-muted transition-colors"
          disabled={isSimulating}
        >
          <span>+ Generate Processes</span>
        </Button>

        <Button
          onClick={onStartSimulation}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold transition-colors py-2 h-auto"
          disabled={isSimulating}
        >
          <Play className="w-4 h-4 mr-2" />
          {isSimulating ? 'Running...' : 'Start Simulation'}
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full font-medium hover:bg-destructive/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>
    </Card>
  );
};

export default AlgorithmSelector;
