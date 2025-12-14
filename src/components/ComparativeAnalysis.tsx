import { AlgorithmMetrics } from '@/types/process';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ComparativeAnalysisProps {
  metrics: AlgorithmMetrics[];
  selectedAlgorithm: string;
  optimalAlgorithm: string;
}

const ComparativeAnalysis = ({
  metrics,
  selectedAlgorithm,
  optimalAlgorithm
}: ComparativeAnalysisProps) => {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  // Prepare data for chart - normalize values for better visualization
  const chartData = metrics.map(m => ({
    algorithm: m.algorithm,
    waitingTime: Math.round(m.avgWaitingTime * 10) / 10,
    turnaroundTime: Math.round(m.avgTurnaroundTime * 10) / 10,
    responseTime: Math.round(m.avgResponseTime * 10) / 10,
    cpuUtilization: Math.round(m.cpuUtilization)
  }));

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6 shadow-sm border-border">
        <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
          <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Algorithm Comparison</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Performance metrics across all algorithms</p>
          </div>
        </div>

        {/* Metrics Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-3 font-semibold text-muted-foreground">Algorithm</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">Wait Time</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground hidden sm:table-cell">Turnaround</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground hidden md:table-cell">Response</th>
                <th className="text-right py-3 px-3 font-semibold text-muted-foreground">CPU Util</th>
                <th className="text-center py-3 px-3 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(m => {
                const isOptimal = m.algorithm === optimalAlgorithm;
                const isSelected = m.algorithm === selectedAlgorithm;
                const rowClass = isOptimal 
                  ? 'bg-green-50 dark:bg-green-950/20 border-b border-border hover:bg-green-100/50 dark:hover:bg-green-950/30'
                  : isSelected
                  ? 'bg-orange-50 dark:bg-orange-950/20 border-b border-border hover:bg-orange-100/50 dark:hover:bg-orange-950/30'
                  : 'border-b border-border hover:bg-muted/40';

                return (
                  <tr key={m.algorithm} className={`${rowClass} transition-colors`}>
                    <td className="py-3 px-3 font-semibold text-foreground">
                      {m.algorithm}
                    </td>
                    <td className="py-3 px-3 text-right text-foreground">{m.avgWaitingTime.toFixed(1)}s</td>
                    <td className="py-3 px-3 text-right text-foreground hidden sm:table-cell">{m.avgTurnaroundTime.toFixed(1)}s</td>
                    <td className="py-3 px-3 text-right text-foreground hidden md:table-cell">{m.avgResponseTime.toFixed(1)}s</td>
                    <td className="py-3 px-3 text-right text-foreground">{m.cpuUtilization.toFixed(0)}%</td>
                    <td className="py-3 px-3 text-center">
                      {isOptimal && (
                        <span className="inline-block px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full border border-green-200 dark:border-green-900/50">
                          ✓ Optimal
                        </span>
                      )}
                      {isSelected && !isOptimal && (
                        <span className="inline-block px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold rounded-full border border-orange-200 dark:border-orange-900/50">
                          ◆ Selected
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Waiting Time Chart */}
          <div className="border-t border-border pt-6">
            <h4 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-blue-400"></span>
              Average Waiting Time (lower is better)
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="algorithm" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                  formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(1)}s` : value}
                />
                <Bar 
                  dataKey="waitingTime" 
                  fill="#3b82f6" 
                  radius={[6, 6, 0, 0]}
                  isAnimationActive
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Turnaround Time Chart */}
          <div className="border-t border-border pt-6">
            <h4 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-purple-400"></span>
              Average Turnaround Time (lower is better)
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="algorithm" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                  formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(1)}s` : value}
                />
                <Bar 
                  dataKey="turnaroundTime" 
                  fill="#8b5cf6" 
                  radius={[6, 6, 0, 0]}
                  isAnimationActive
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* CPU Utilization Chart */}
          <div className="border-t border-border pt-6">
            <h4 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-green-400"></span>
              CPU Utilization (higher is better)
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="algorithm" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                  formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(0)}%` : value}
                />
                <Bar 
                  dataKey="cpuUtilization" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]}
                  isAnimationActive
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg">
            <p className="text-xs font-semibold text-green-900 dark:text-green-100 uppercase tracking-wider mb-1">Recommended</p>
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong className="text-base">{optimalAlgorithm}</strong> is best for these processes based on weighted performance metrics
            </p>
          </div>
          {selectedAlgorithm !== optimalAlgorithm && (
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-lg">
              <p className="text-xs font-semibold text-orange-900 dark:text-orange-100 uppercase tracking-wider mb-1">Your Selection</p>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                You chose <strong className="text-base">{selectedAlgorithm}</strong>, which will be slightly less efficient than the optimal choice
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ComparativeAnalysis;
