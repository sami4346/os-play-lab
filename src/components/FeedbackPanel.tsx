import { Card } from '@/components/ui/card';
import { Trophy, TrendingUp, Clock, Cpu, AlertCircle, Activity } from 'lucide-react';
import { SchedulingResult } from '@/types/process';

interface FeedbackPanelProps {
  result: SchedulingResult | null;
  score: number;
  feedback: string[];
  optimalAlgorithm?: string;
  mlRecommendedAlgorithm?: string;
  useMLSuggestion?: boolean;
}

const FeedbackPanel = ({ result, score, feedback, optimalAlgorithm, mlRecommendedAlgorithm, useMLSuggestion }: FeedbackPanelProps) => {
  if (!result) return null;

  return (
    <Card className="p-5 sm:p-6 space-y-6 shadow-sm border-border bg-gradient-to-br from-card to-muted/10 animate-fade-in">
      {/* Score Display */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-warning flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Simulation Complete</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Results & analysis</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Score</div>
          <span className="text-3xl font-bold text-primary block leading-none">
            +{score}
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-muted/40 p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-warning flex-shrink-0" />
            <span className="text-xs font-semibold text-muted-foreground uppercase">Waiting</span>
          </div>
          <span className="text-lg sm:text-2xl font-bold text-foreground block">
            {result.avgWaitingTime.toFixed(1)}s
          </span>
          <p className="text-xs text-muted-foreground mt-1">Average</p>
        </div>

        <div className="bg-muted/40 p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-secondary flex-shrink-0" />
            <span className="text-xs font-semibold text-muted-foreground uppercase">Turnaround</span>
          </div>
          <span className="text-lg sm:text-2xl font-bold text-foreground block">
            {result.avgTurnaroundTime.toFixed(1)}s
          </span>
          <p className="text-xs text-muted-foreground mt-1">Average</p>
        </div>

        <div className="bg-muted/40 p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-info flex-shrink-0" />
            <span className="text-xs font-semibold text-muted-foreground uppercase">Response</span>
          </div>
          <span className="text-lg sm:text-2xl font-bold text-foreground block">
            {result.avgResponseTime.toFixed(1)}s
          </span>
          <p className="text-xs text-muted-foreground mt-1">Average</p>
        </div>

        <div className="bg-muted/40 p-3 sm:p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-success flex-shrink-0" />
            <span className="text-xs font-semibold text-muted-foreground uppercase">CPU Util</span>
          </div>
          <span className="text-lg sm:text-2xl font-bold text-foreground block">
            {result.cpuUtilization.toFixed(0)}%
          </span>
          <p className="text-xs text-muted-foreground mt-1">Utilization</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg border border-border">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Time</span>
          <p className="text-xl font-bold text-foreground mt-1">{result.totalTime.toFixed(1)}s</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Throughput</span>
          <p className="text-xl font-bold text-foreground mt-1">{result.throughput.toFixed(0)}%</p>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedback.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <h4 className="font-semibold text-foreground">Key Insights</h4>
          </div>
          <div className="space-y-2">
            {feedback.map((msg, index) => (
              <div 
                key={index} 
                className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-100 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                💡 {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-3">
        {useMLSuggestion && mlRecommendedAlgorithm && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-950/30 dark:to-purple-950/10 border-2 border-purple-200 dark:border-purple-900/50 rounded-lg">
            <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">🤖 AI Recommendation</p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Based on your workload, <strong className="font-bold">{mlRecommendedAlgorithm}</strong> would be optimal
            </p>
          </div>
        )}
        {optimalAlgorithm && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/30 dark:to-green-950/10 border-2 border-green-200 dark:border-green-900/50 rounded-lg">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">✨ Optimal Match</p>
            <p className="text-sm text-green-800 dark:text-green-200">
              For this scenario, <strong className="font-bold">{optimalAlgorithm}</strong> is the best choice
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FeedbackPanel;
