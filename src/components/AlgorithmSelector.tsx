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
  isSimulating
}: AlgorithmSelectorProps) => {
  return (
    <Card className="p-6 space-y-6 shadow-elegant border-border">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Simulation Controls</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="algorithm" className="text-sm font-medium">
            CPU Scheduling Algorithm
          </Label>
          <Select value={selectedAlgorithm} onValueChange={onAlgorithmChange}>
            <SelectTrigger id="algorithm" className="w-full">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FCFS">First Come First Serve (FCFS)</SelectItem>
              <SelectItem value="SJF">Shortest Job First (SJF)</SelectItem>
              <SelectItem value="SRJF">Shortest Remaining Job First (SRJF)</SelectItem>
              <SelectItem value="RR">Round Robin (RR)</SelectItem>
              <SelectItem value="Priority">Priority Scheduling</SelectItem>
              <SelectItem value="RR+Priority">Round Robin + Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(selectedAlgorithm === 'RR' || selectedAlgorithm === 'RR+Priority') && (
          <div className="space-y-2">
            <Label htmlFor="quantum" className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time Quantum (seconds)
            </Label>
            <Input
              id="quantum"
              type="number"
              min="1"
              max="10"
              value={timeQuantum}
              onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 2)}
              className="w-full"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="memory" className="text-sm font-medium">
            Memory Allocation Mode
          </Label>
          <Select value={memoryMode} onValueChange={onMemoryModeChange}>
            <SelectTrigger id="memory" className="w-full">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual Placement</SelectItem>
              <SelectItem value="firstFit">First Fit</SelectItem>
              <SelectItem value="bestFit">Best Fit</SelectItem>
              <SelectItem value="worstFit">Worst Fit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <Button
          onClick={onGenerateProcesses}
          variant="outline"
          className="w-full"
          disabled={isSimulating}
        >
          Generate Random Processes
        </Button>

        <Button
          onClick={onStartSimulation}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          disabled={isSimulating}
        >
          <Play className="w-4 h-4 mr-2" />
          Start Simulation
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </Card>
  );
};

export default AlgorithmSelector;
