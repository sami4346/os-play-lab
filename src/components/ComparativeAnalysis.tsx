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
      <Card className="p-6 shadow-elegant border-border">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Algorithm Comparison</h3>
        </div>

        {/* Metrics Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-4 font-semibold">Algorithm</th>
                <th className="text-right py-2 px-4 font-semibold">Avg Wait Time</th>
                <th className="text-right py-2 px-4 font-semibold">Avg Turnaround</th>
                <th className="text-right py-2 px-4 font-semibold">Avg Response</th>
                <th className="text-right py-2 px-4 font-semibold">CPU Util %</th>
                <th className="text-center py-2 px-4 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(m => {
                const isOptimal = m.algorithm === optimalAlgorithm;
                const isSelected = m.algorithm === selectedAlgorithm;
                const rowClass = isOptimal 
                  ? 'bg-success/10 border-b border-border' 
                  : isSelected
                  ? 'bg-warning/10 border-b border-border'
                  : 'border-b border-border';

                return (
                  <tr key={m.algorithm} className={rowClass}>
                    <td className="py-3 px-4 font-medium">
                      {m.algorithm}
                      {isOptimal && <span className="ml-2 text-xs bg-success text-success-foreground px-2 py-1 rounded">OPTIMAL</span>}
                      {isSelected && !isOptimal && <span className="ml-2 text-xs bg-warning text-warning-foreground px-2 py-1 rounded">SELECTED</span>}
                    </td>
                    <td className="py-3 px-4 text-right">{m.avgWaitingTime.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">{m.avgTurnaroundTime.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">{m.avgResponseTime.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">{m.cpuUtilization.toFixed(2)}%</td>
                    <td className="py-3 px-4 text-center">
                      {m.algorithm === optimalAlgorithm && <span className="text-success font-semibold">✓</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div className="mt-8 space-y-8">
          {/* Waiting Time Chart */}
          <div>
            <h4 className="font-medium mb-4">Average Waiting Time (lower is better)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="algorithm" />
                <YAxis />
                <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) : value} />
                <Bar 
                  dataKey="waitingTime" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Turnaround Time Chart */}
          <div>
            <h4 className="font-medium mb-4">Average Turnaround Time (lower is better)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="algorithm" />
                <YAxis />
                <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) : value} />
                <Bar 
                  dataKey="turnaroundTime" 
                  fill="#8b5cf6" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Response Time Chart */}
          <div>
            <h4 className="font-medium mb-4">Average Response Time (lower is better)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="algorithm" />
                <YAxis />
                <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) : value} />
                <Bar 
                  dataKey="responseTime" 
                  fill="#ec4899" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* CPU Utilization Chart */}
          <div>
            <h4 className="font-medium mb-4">CPU Utilization (higher is better)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="algorithm" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(2)}%` : value} />
                <Bar 
                  dataKey="cpuUtilization" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Optimal Algorithm:</strong> {optimalAlgorithm} is recommended for these processes based on weighted metrics (40% waiting time, 30% turnaround time, 20% response time, 10% CPU utilization).
          </p>
          {selectedAlgorithm !== optimalAlgorithm && (
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Your Selection:</strong> You selected {selectedAlgorithm}, which would result in higher metrics compared to {optimalAlgorithm}.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ComparativeAnalysis;
