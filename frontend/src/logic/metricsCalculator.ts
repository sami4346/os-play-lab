import { Process, SchedulingResult, MemoryBlock, AlgorithmMetrics, MemoryMetrics } from '@/types/process';
import { fcfs, sjf, srjf, roundRobin, priorityScheduling, rrWithPriority } from './cpuAlgorithms';

/**
 * Calculate memory metrics including utilization and fragmentation
 */
export const calculateMemoryMetrics = (memoryBlocks: MemoryBlock[], totalMemory: number = 1000): MemoryMetrics => {
  const usedMemory = memoryBlocks
    .filter(b => b.pid !== null)
    .reduce((sum, b) => sum + b.size, 0);

  const utilization = (usedMemory / totalMemory) * 100;

  // External fragmentation: percentage of free memory that is fragmented
  const freeBlocks = memoryBlocks.filter(b => b.pid === null);
  const totalFreeMemory = freeBlocks.reduce((sum, b) => sum + b.size, 0);
  const largestFreeBlock = freeBlocks.length > 0 ? Math.max(...freeBlocks.map(b => b.size)) : 0;

  // External fragmentation = (total free - largest free) / total free
  const externalFragmentation = totalFreeMemory > 0 
    ? ((totalFreeMemory - largestFreeBlock) / totalFreeMemory) * 100 
    : 0;

  // Internal fragmentation - typically 0 for our allocation scheme
  const internalFragmentation = 0;

  return {
    utilization,
    externalFragmentation,
    internalFragmentation,
    largestFreeBlock
  };
};

/**
 * Run all scheduling algorithms and return comparative metrics
 */
export const runComparativeAnalysis = (processes: Process[], timeQuantum: number = 2): AlgorithmMetrics[] => {
  const algorithms = [
    { name: 'FCFS', fn: fcfs },
    { name: 'SJF', fn: sjf },
    { name: 'SRJF', fn: srjf },
    { name: 'RR', fn: (procs: Process[]) => roundRobin(procs, timeQuantum) },
    { name: 'Priority', fn: priorityScheduling },
    { name: 'RR+Priority', fn: (procs: Process[]) => rrWithPriority(procs, timeQuantum) }
  ];

  const results: AlgorithmMetrics[] = [];

  for (const algo of algorithms) {
    try {
      const processCopies = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
      const result = algo.fn(processCopies);

      results.push({
        algorithm: algo.name,
        avgWaitingTime: result.avgWaitingTime,
        avgTurnaroundTime: result.avgTurnaroundTime,
        avgResponseTime: result.avgResponseTime,
        cpuUtilization: result.cpuUtilization,
        throughput: result.throughput
      });
    } catch (error) {
      console.error(`Error running ${algo.name}:`, error);
    }
  }

  return results;
};

/**
 * Find the best algorithm based on comparative analysis
 */
export const findBestAlgorithm = (metrics: AlgorithmMetrics[]): string => {
  if (metrics.length === 0) return 'FCFS';

  // Sort by weighted score: 40% waiting time, 30% turnaround time, 20% response time, 10% CPU utilization
  const scored = metrics.map(m => ({
    algorithm: m.algorithm,
    score: 
      (1 - (m.avgWaitingTime / Math.max(...metrics.map(x => x.avgWaitingTime)))) * 40 +
      (1 - (m.avgTurnaroundTime / Math.max(...metrics.map(x => x.avgTurnaroundTime)))) * 30 +
      (1 - (m.avgResponseTime / Math.max(...metrics.map(x => x.avgResponseTime)))) * 20 +
      (m.cpuUtilization / 100) * 10
  }));

  return scored.reduce((best, current) => current.score > best.score ? current : best).algorithm;
};

/**
 * Generate human-readable insights from metrics
 */
export const generateMetricsInsights = (metrics: AlgorithmMetrics[], selectedAlgorithm: string): string[] => {
  const insights: string[] = [];

  if (metrics.length === 0) return insights;

  // Find best and worst algorithms for each metric
  const bestWaiting = metrics.reduce((best, m) => 
    m.avgWaitingTime < best.avgWaitingTime ? m : best
  );
  const bestTurnaround = metrics.reduce((best, m) => 
    m.avgTurnaroundTime < best.avgTurnaroundTime ? m : best
  );
  const bestResponse = metrics.reduce((best, m) => 
    m.avgResponseTime < best.avgResponseTime ? m : best
  );
  const bestUtilization = metrics.reduce((best, m) => 
    m.cpuUtilization > best.cpuUtilization ? m : best
  );

  insights.push(`📊 Best for waiting time: ${bestWaiting.algorithm} (${bestWaiting.avgWaitingTime.toFixed(2)})`);
  insights.push(`📊 Best for turnaround time: ${bestTurnaround.algorithm} (${bestTurnaround.avgTurnaroundTime.toFixed(2)})`);
  insights.push(`📊 Best for response time: ${bestResponse.algorithm} (${bestResponse.avgResponseTime.toFixed(2)})`);
  insights.push(`📊 Best CPU utilization: ${bestUtilization.algorithm} (${bestUtilization.cpuUtilization.toFixed(2)}%)`);

  return insights;
};
