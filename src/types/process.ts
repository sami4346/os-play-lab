export type ProcessStatus = 'waiting' | 'running' | 'completed';

export interface Process {
  pid: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  memoryRequired: number;
  status: ProcessStatus;
  remainingTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
  startTime?: number;
  responseTime?: number;
  color?: string;
}

export interface GanttChartItem {
  pid: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface SchedulingResult {
  ganttChart: GanttChartItem[];
  processes: Process[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  cpuUtilization: number;
  throughput: number;
  totalTime: number;
}

export interface MemoryBlock {
  id: string;
  pid: string | null;
  start: number;
  size: number;
  color?: string;
}

export interface SimulationResult {
  scheduling: SchedulingResult;
  memory: MemoryBlock[];
  score: number;
  feedback: string[];
  optimalAlgorithm?: string;
}

export interface AlgorithmMetrics {
  algorithm: string;
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  cpuUtilization: number;
  throughput: number;
}

export interface MemoryMetrics {
  utilization: number;
  externalFragmentation: number;
  internalFragmentation: number;
  largestFreeBlock: number;
}
