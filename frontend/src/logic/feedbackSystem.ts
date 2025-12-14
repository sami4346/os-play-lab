import { Process, SchedulingResult, MemoryBlock, AlgorithmMetrics } from '@/types/process';
import { calculateFragmentation } from './memoryManager';
import { runComparativeAnalysis, findBestAlgorithm, generateMetricsInsights } from './metricsCalculator';

export interface FeedbackResult {
  score: number;
  feedback: string[];
  optimalAlgorithm: string;
  comparativeMetrics?: AlgorithmMetrics[];
}

export const evaluateSimulation = (
  processes: Process[],
  schedulingResult: SchedulingResult,
  memoryBlocks: MemoryBlock[],
  selectedAlgorithm: string,
  memoryMode: string,
  timeQuantum: number = 2
): FeedbackResult => {
  let score = 0;
  const feedback: string[] = [];

  // Defensive: handle empty list
  if (!processes || processes.length === 0) {
    return {
      score: Math.max(0, score),
      feedback,
      optimalAlgorithm: 'FCFS'
    };
  }

  // Run comparative analysis to find the best algorithm
  const comparativeMetrics = runComparativeAnalysis(processes, timeQuantum);
  const optimalAlgorithm = findBestAlgorithm(comparativeMetrics);

  // Generate insights from comparative analysis
  const insights = generateMetricsInsights(comparativeMetrics, selectedAlgorithm);
  feedback.push(...insights);

  // Compare selectedAlgorithm (UI value) with optimalAlgorithm
  if (selectedAlgorithm === optimalAlgorithm) {
    score += 10;
    feedback.push('✅ Excellent! You selected the optimal scheduling algorithm.');
  } else {
    feedback.push(`💡 For these processes, ${optimalAlgorithm} would be more efficient.`);
  }

  // Score for memory allocation: prefer automatic modes
  if (['firstFit', 'bestFit', 'worstFit'].includes(memoryMode)) {
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

  // Evaluate efficiency based on metrics
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

  // Add response time feedback
  if (schedulingResult.avgResponseTime < 5) {
    score += 5;
    feedback.push('✅ Great response time! Processes start execution quickly.');
  }

  // Remove duplicate messages while preserving order
  const seen = new Set<string>();
  const uniqueFeedback: string[] = [];
  for (const msg of feedback) {
    if (!seen.has(msg)) {
      uniqueFeedback.push(msg);
      seen.add(msg);
    }
  }

  // Bonus for high score
  if (score > 40) {
    uniqueFeedback.push('🎉 Perfect simulation! You mastered OS concepts!');
  }

  return {
    score: Math.max(0, score),
    feedback: uniqueFeedback,
    optimalAlgorithm,
    comparativeMetrics
  };
};
