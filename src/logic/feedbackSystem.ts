import { Process, SchedulingResult, MemoryBlock } from '@/types/process';
import { calculateFragmentation } from './memoryManager';

export interface FeedbackResult {
  score: number;
  feedback: string[];
  optimalAlgorithm: string;
}

export const evaluateSimulation = (
  processes: Process[],
  schedulingResult: SchedulingResult,
  memoryBlocks: MemoryBlock[],
  selectedAlgorithm: string,
  memoryMode: string
): FeedbackResult => {
  let score = 0;
  const feedback: string[] = [];

  // Determine optimal scheduling algorithm based on process characteristics
  const avgBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0) / processes.length;
  const hasPriorities = processes.some(p => p.priority !== processes[0].priority);
  const hasVariedArrival = processes.some(p => p.arrivalTime !== processes[0].arrivalTime);

  let optimalAlgorithm = 'FCFS';
  
  if (hasPriorities) {
    optimalAlgorithm = 'Priority';
  } else if (avgBurstTime < 5) {
    optimalAlgorithm = 'SJF';
  } else if (hasVariedArrival) {
    optimalAlgorithm = 'SRJF';
  } else {
    optimalAlgorithm = 'Round Robin';
  }

  // Score for correct algorithm selection
  if (selectedAlgorithm === optimalAlgorithm) {
    score += 10;
    feedback.push('✅ Excellent! You selected the optimal scheduling algorithm.');
  } else {
    feedback.push(`💡 For these processes, ${optimalAlgorithm} would be more efficient.`);
  }

  // Score for memory allocation
  if (memoryMode !== 'manual') {
    score += 10;
    feedback.push('✅ Good choice using automatic memory allocation.');
  }

  // Score for each completed process
  const completedCount = processes.filter(p => p.status === 'completed').length;
  score += completedCount * 2;
  feedback.push(`✅ Successfully completed ${completedCount} processes (+${completedCount * 2} points).`);

  // Evaluate fragmentation
  const fragmentation = calculateFragmentation(memoryBlocks);
  if (fragmentation > 40) {
    score -= 5;
    feedback.push(`⚠️ High memory fragmentation (${fragmentation.toFixed(1)}%). Consider compacting memory.`);
  } else if (fragmentation < 20) {
    score += 5;
    feedback.push(`✅ Excellent memory management! Low fragmentation (${fragmentation.toFixed(1)}%).`);
  }

  // Evaluate efficiency
  if (schedulingResult.avgWaitingTime < 5) {
    score += 10;
    feedback.push('✅ Outstanding! Very low average waiting time.');
  } else if (schedulingResult.avgWaitingTime > 15) {
    feedback.push('💡 Try to minimize waiting time by choosing better algorithms.');
  }

  if (schedulingResult.cpuUtilization > 90) {
    score += 5;
    feedback.push('✅ Excellent CPU utilization!');
  }

  // Bonus for perfect execution
  if (score > 40) {
    feedback.push('🎉 Perfect simulation! You mastered OS concepts!');
  }

  return {
    score: Math.max(0, score),
    feedback,
    optimalAlgorithm
  };
};
