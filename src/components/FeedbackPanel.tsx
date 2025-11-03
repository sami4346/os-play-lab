import { Card } from '@/components/ui/card';
import { Trophy, TrendingUp, Clock, Cpu, AlertCircle } from 'lucide-react';
import { SchedulingResult } from '@/types/process';

interface FeedbackPanelProps {
  result: SchedulingResult | null;
  score: number;
  feedback: string[];
  optimalAlgorithm?: string;
}

const FeedbackPanel = ({ result, score, feedback, optimalAlgorithm }: FeedbackPanelProps) => {
  if (!result) return null;

  return (
    <Card className="p-6 space-y-6 shadow-elegant border-border bg-gradient-to-br from-card to-muted/20 animate-fade-in">
      {/* Score Display */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-warning" />
          <h3 className="font-semibold text-lg">Simulation Results</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Score:</span>
          <span className="text-3xl font-bold text-primary animate-pulse-glow">
            {score}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-warning" />
            <span className="text-xs font-medium text-muted-foreground">Avg Waiting Time</span>
          </div>
          <span className="text-2xl font-bold text-foreground">
            {result.avgWaitingTime.toFixed(2)}s
          </span>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <span className="text-xs font-medium text-muted-foreground">Avg Turnaround</span>
          </div>
          <span className="text-2xl font-bold text-foreground">
            {result.avgTurnaroundTime.toFixed(2)}s
          </span>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-success" />
            <span className="text-xs font-medium text-muted-foreground">CPU Utilization</span>
          </div>
          <span className="text-2xl font-bold text-foreground">
            {result.cpuUtilization.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Feedback Messages */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-primary" />
          <h4 className="font-semibold">Feedback & Recommendations</h4>
        </div>
        {feedback.map((msg, index) => (
          <div 
            key={index} 
            className="p-3 bg-muted/50 rounded-lg text-sm border border-border animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {msg}
          </div>
        ))}
      </div>

      {optimalAlgorithm && (
        <div className="p-4 bg-primary/10 border-2 border-primary rounded-lg">
          <span className="text-sm font-medium text-primary">
            💡 Optimal Algorithm for this scenario: <strong>{optimalAlgorithm}</strong>
          </span>
        </div>
      )}
    </Card>
  );
};

export default FeedbackPanel;
