import { Process, SchedulingResult, GanttChartItem } from '@/types/process';

// Helper to calculate metrics
const calculateMetrics = (processes: Process[]): SchedulingResult => {
  const ganttChart: GanttChartItem[] = [];
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalTime = 0;

  processes.forEach(p => {
    if (p.completionTime !== undefined) {
      totalWaitingTime += p.waitingTime || 0;
      totalTurnaroundTime += p.turnaroundTime || 0;
      totalTime = Math.max(totalTime, p.completionTime);
    }
  });

  const avgWaitingTime = totalWaitingTime / processes.length;
  const avgTurnaroundTime = totalTurnaroundTime / processes.length;
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const cpuUtilization = (totalBurstTime / totalTime) * 100;

  return {
    ganttChart,
    processes,
    avgWaitingTime,
    avgTurnaroundTime,
    cpuUtilization
  };
};

// FCFS - First Come First Serve
export const fcfs = (processes: Process[]): SchedulingResult => {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;

  sortedProcesses.forEach(process => {
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }

    process.startTime = currentTime;
    process.completionTime = currentTime + process.burstTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;

    ganttChart.push({
      pid: process.pid,
      startTime: currentTime,
      endTime: process.completionTime,
      color: process.color || '#3b82f6'
    });

    currentTime = process.completionTime;
  });

  return calculateMetrics(sortedProcesses);
};

// SJF - Shortest Job First (Non-preemptive)
export const sjf = (processes: Process[]): SchedulingResult => {
  const remainingProcesses = [...processes];
  const completed: Process[] = [];
  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;

  while (remainingProcesses.length > 0) {
    const available = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      continue;
    }

    const shortest = available.reduce((min, p) => 
      p.burstTime < min.burstTime ? p : min
    );

    shortest.startTime = currentTime;
    shortest.completionTime = currentTime + shortest.burstTime;
    shortest.turnaroundTime = shortest.completionTime - shortest.arrivalTime;
    shortest.waitingTime = shortest.turnaroundTime - shortest.burstTime;

    ganttChart.push({
      pid: shortest.pid,
      startTime: currentTime,
      endTime: shortest.completionTime,
      color: shortest.color || '#3b82f6'
    });

    currentTime = shortest.completionTime;
    completed.push(shortest);
    remainingProcesses.splice(remainingProcesses.indexOf(shortest), 1);
  }

  return calculateMetrics(completed);
};

// SRJF - Shortest Remaining Job First (Preemptive)
export const srjf = (processes: Process[]): SchedulingResult => {
  const workingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  let currentTime = 0;
  const maxTime = Math.max(...processes.map(p => p.arrivalTime + p.burstTime)) + 100;

  while (completed.length < processes.length && currentTime < maxTime) {
    const available = workingProcesses.filter(
      p => p.arrivalTime <= currentTime && p.remainingTime! > 0
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    const shortest = available.reduce((min, p) => 
      p.remainingTime! < min.remainingTime! ? p : min
    );

    if (shortest.startTime === undefined) {
      shortest.startTime = currentTime;
    }

    const lastGantt = ganttChart[ganttChart.length - 1];
    if (lastGantt && lastGantt.pid === shortest.pid && lastGantt.endTime === currentTime) {
      lastGantt.endTime = currentTime + 1;
    } else {
      ganttChart.push({
        pid: shortest.pid,
        startTime: currentTime,
        endTime: currentTime + 1,
        color: shortest.color || '#3b82f6'
      });
    }

    shortest.remainingTime!--;
    currentTime++;

    if (shortest.remainingTime === 0) {
      shortest.completionTime = currentTime;
      shortest.turnaroundTime = shortest.completionTime - shortest.arrivalTime;
      shortest.waitingTime = shortest.turnaroundTime - shortest.burstTime;
      completed.push(shortest);
    }
  }

  return calculateMetrics(workingProcesses);
};

// Round Robin
export const roundRobin = (processes: Process[], timeQuantum: number = 2): SchedulingResult => {
  const queue = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  let currentTime = 0;
  let index = 0;
  const readyQueue: typeof queue = [];

  queue.sort((a, b) => a.arrivalTime - b.arrivalTime);

  while (completed.length < processes.length) {
    // Add arrived processes to ready queue
    while (index < queue.length && queue[index].arrivalTime <= currentTime) {
      if (queue[index].remainingTime! > 0) {
        readyQueue.push(queue[index]);
      }
      index++;
    }

    if (readyQueue.length === 0) {
      currentTime++;
      continue;
    }

    const process = readyQueue.shift()!;
    
    if (process.startTime === undefined) {
      process.startTime = currentTime;
    }

    const executeTime = Math.min(timeQuantum, process.remainingTime!);
    
    ganttChart.push({
      pid: process.pid,
      startTime: currentTime,
      endTime: currentTime + executeTime,
      color: process.color || '#3b82f6'
    });

    process.remainingTime! -= executeTime;
    currentTime += executeTime;

    // Add newly arrived processes
    while (index < queue.length && queue[index].arrivalTime <= currentTime) {
      if (queue[index].remainingTime! > 0) {
        readyQueue.push(queue[index]);
      }
      index++;
    }

    if (process.remainingTime === 0) {
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      completed.push(process);
    } else {
      readyQueue.push(process);
    }
  }

  return calculateMetrics(queue);
};

// Priority Scheduling (Non-preemptive)
export const priorityScheduling = (processes: Process[]): SchedulingResult => {
  const remainingProcesses = [...processes];
  const completed: Process[] = [];
  const ganttChart: GanttChartItem[] = [];
  let currentTime = 0;

  while (remainingProcesses.length > 0) {
    const available = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      continue;
    }

    // Lower priority number = higher priority
    const highestPriority = available.reduce((min, p) => 
      p.priority < min.priority ? p : min
    );

    highestPriority.startTime = currentTime;
    highestPriority.completionTime = currentTime + highestPriority.burstTime;
    highestPriority.turnaroundTime = highestPriority.completionTime - highestPriority.arrivalTime;
    highestPriority.waitingTime = highestPriority.turnaroundTime - highestPriority.burstTime;

    ganttChart.push({
      pid: highestPriority.pid,
      startTime: currentTime,
      endTime: highestPriority.completionTime,
      color: highestPriority.color || '#3b82f6'
    });

    currentTime = highestPriority.completionTime;
    completed.push(highestPriority);
    remainingProcesses.splice(remainingProcesses.indexOf(highestPriority), 1);
  }

  return calculateMetrics(completed);
};

// Round Robin + Priority
export const rrWithPriority = (processes: Process[], timeQuantum: number = 2): SchedulingResult => {
  // Sort by priority, then apply round robin within same priority
  const sortedByPriority = [...processes].sort((a, b) => a.priority - b.priority);
  return roundRobin(sortedByPriority, timeQuantum);
};
