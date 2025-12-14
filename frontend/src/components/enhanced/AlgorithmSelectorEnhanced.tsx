import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Play, RotateCcw, Sparkles, Zap, Target, Users, Star } from 'lucide-react';
import { EnhancedCard } from '@/components/enhanced/EnhancedCard';
import { EnhancedButton } from '@/components/enhanced/EnhancedButton';
import { cn } from '@/lib/utils';

interface AlgorithmSelectorEnhancedProps {
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
  mlRecommendedAlgorithm?: string;
}

const algorithms = [
  {
    id: 'FCFS',
    name: 'FCFS',
    icon: Clock,
    description: 'First Come First Serve',
    trait: 'Simple & Sequential',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'SJF',
    name: 'SJF',
    icon: Target,
    description: 'Shortest Job First',
    trait: 'Fast & Efficient',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'SRJF',
    name: 'SRJF',
    icon: Zap,
    description: 'Shortest Remaining Job',
    trait: 'Smart & Adaptive',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'RR',
    name: 'Round Robin',
    icon: Users,
    description: 'Time-Shared Execution',
    trait: 'Fair Distribution',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'Priority',
    name: 'Priority',
    icon: Star,
    description: 'Priority-Based',
    trait: 'Important First',
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 'RR+Priority',
    name: 'RR + Priority',
    icon: Sparkles,
    description: 'Combined Approach',
    trait: 'Best of Both',
    color: 'from-indigo-500 to-purple-500'
  }
];

const memoryModes = [
  { id: 'firstFit', name: 'First Fit', description: 'Fastest allocation' },
  { id: 'bestFit', name: 'Best Fit', description: 'Minimal waste' },
  { id: 'worstFit', name: 'Worst Fit', description: 'Largest block' }
];

const AlgorithmSelectorEnhanced = ({
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
  onMLSuggestionChange,
  mlRecommendedAlgorithm
}: AlgorithmSelectorEnhancedProps) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <EnhancedCard variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Simulation Controls</h3>
              <p className="text-sm text-muted-foreground">Configure your simulation</p>
            </div>
          </div>
          <div className="flex gap-2">
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={onReset}
              icon={<RotateCcw className="w-4 h-4" />}
              disabled={isSimulating}
            >
              Reset
            </EnhancedButton>
            <EnhancedButton
              variant="default"
              size="sm"
              onClick={onGenerateProcesses}
              icon={<Sparkles className="w-4 h-4" />}
              disabled={isSimulating}
            >
              Generate
            </EnhancedButton>
          </div>
        </div>
      </EnhancedCard>

      {/* ML Suggestion Toggle */}
      <EnhancedCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">AI-Powered Recommendation</p>
              <p className="text-xs text-muted-foreground">Let ML suggest the best algorithm</p>
            </div>
          </div>
          <Button
            variant={useMLSuggestion ? 'default' : 'outline'}
            size="sm"
            onClick={() => onMLSuggestionChange(!useMLSuggestion)}
          >
            {useMLSuggestion ? 'Enabled' : 'Enable'}
          </Button>
        </div>
        {useMLSuggestion && mlRecommendedAlgorithm && (
          <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm">
              <span className="font-semibold">AI Recommendation:</span>{' '}
              <span className="text-primary">{mlRecommendedAlgorithm}</span>
            </p>
          </div>
        )}
      </EnhancedCard>

      {/* Algorithm Selection Cards */}
      <div>
        <Label className="text-base font-semibold mb-4 block">
          Choose Scheduling Algorithm
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {algorithms.map((algo) => {
            const Icon = algo.icon;
            const isSelected = selectedAlgorithm === algo.id;
            const isRecommended = mlRecommendedAlgorithm === algo.id;

            return (
              <EnhancedCard
                key={algo.id}
                variant={isSelected ? 'elevated' : 'default'}
                hover={!useMLSuggestion}
                onClick={() => !useMLSuggestion && onAlgorithmChange(algo.id)}
                className={cn(
                  'p-4 cursor-pointer relative overflow-hidden transition-all',
                  isSelected && 'ring-2 ring-primary ring-offset-2',
                  useMLSuggestion && 'opacity-50 cursor-not-allowed'
                )}
              >
                {/* Background gradient on hover */}
                {!useMLSuggestion && (
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity',
                    algo.color,
                    isSelected && 'opacity-10'
                  )} />
                )}

                {/* Recommended badge */}
                {isRecommended && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div className={cn(
                    'p-2 rounded-lg w-fit mb-3 bg-gradient-to-br',
                    algo.color
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{algo.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{algo.description}</p>
                  <div className="inline-block px-2 py-0.5 bg-muted rounded-full text-xs font-medium">
                    {algo.trait}
                  </div>
                </div>
              </EnhancedCard>
            );
          })}
        </div>
      </div>

      {/* Memory & Time Settings */}
      <EnhancedCard className="p-5 space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          Advanced Settings
        </h4>

        {/* Memory Mode */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Memory Allocation Strategy</Label>
          <div className="grid grid-cols-3 gap-2">
            {memoryModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onMemoryModeChange(mode.id)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all text-left',
                  'hover:border-primary/50 hover:bg-primary/5',
                  memoryMode === mode.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
                )}
              >
                <p className="font-semibold text-sm">{mode.name}</p>
                <p className="text-xs text-muted-foreground">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Time Quantum (only for RR algorithms) */}
        {(selectedAlgorithm === 'RR' || selectedAlgorithm === 'RR+Priority') && (
          <div className="space-y-2">
            <Label htmlFor="timeQuantum" className="text-sm font-medium">
              Time Quantum (for Round Robin)
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="timeQuantum"
                type="number"
                min="1"
                value={timeQuantum}
                onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 1)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">time units</span>
            </div>
          </div>
        )}
      </EnhancedCard>

      {/* Start Simulation Button */}
      <EnhancedButton
        variant="gradient"
        size="lg"
        fullWidth
        onClick={onStartSimulation}
        loading={isSimulating}
        icon={<Play className="w-5 h-5" />}
      >
        {isSimulating ? 'Running Simulation...' : 'Start Simulation'}
      </EnhancedButton>
    </div>
  );
};

export default AlgorithmSelectorEnhanced;
