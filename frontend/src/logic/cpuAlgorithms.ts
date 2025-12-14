import { Process, SchedulingResult, GanttChartItem } from '@/types/process';

// Helper to calculate metrics
const calculateMetrics = (processes: Process[], ganttChart: GanttChartItem[]): SchedulingResult => {
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let totalTime = 0;

  processes.forEach(p => {
    if (p.completionTime !== undefined) {
      totalWaitingTime += p.waitingTime || 0;
      totalTurnaroundTime += p.turnaroundTime || 0;
      totalResponseTime += p.responseTime || 0;
      totalTime = Math.max(totalTime, p.completionTime);
    }
  });

  const numProcesses = processes.length || new Set(ganttChart.map(g => g.pid)).size || 1;
  const avgWaitingTime = numProcesses > 0 ? totalWaitingTime / numProcesses : 0;
  const avgTurnaroundTime = numProcesses > 0 ? totalTurnaroundTime / numProcesses : 0;
  const avgResponseTime = numProcesses > 0 ? totalResponseTime / numProcesses : 0;
  const totalBurstTime = processes.reduce((sum, p) => sum + (p.burstTime || 0), 0);
  const cpuUtilization = totalTime > 0 ? (totalBurstTime / totalTime) * 100 : 0;
  const throughput = totalTime > 0 ? (numProcesses / totalTime) * 100 : 0; // processes per unit time

  return {
    ganttChart,
    processes,
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    cpuUtilization,
    throughput,
    totalTime
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
    process.responseTime = currentTime - process.arrivalTime; // Time from arrival to first execution
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

  return calculateMetrics(sortedProcesses, ganttChart);
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
    shortest.responseTime = currentTime - shortest.arrivalTime; // Time from arrival to first execution
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

  return calculateMetrics(completed, ganttChart);
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
      shortest.responseTime = currentTime - shortest.arrivalTime; // Time from arrival to first execution
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

  return calculateMetrics(workingProcesses, ganttChart);
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
      // Jump to next arrival to avoid unnecessary ticks
      if (index < queue.length) {
        currentTime = Math.max(currentTime + 1, queue[index].arrivalTime);
      } else {
        currentTime++;
      }
      continue;
    }

    const process = readyQueue.shift()!;
    
    if (process.startTime === undefined) {
      process.startTime = currentTime;
      process.responseTime = currentTime - process.arrivalTime; // Time from arrival to first execution
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

  return calculateMetrics(queue, ganttChart);
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
    highestPriority.responseTime = currentTime - highestPriority.arrivalTime; // Time from arrival to first execution
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

  return calculateMetrics(completed, ganttChart);
};

// Round Robin + Priority
export const rrWithPriority = (processes: Process[], timeQuantum: number = 2): SchedulingResult => {
  // Implement priority-aware Round Robin: always schedule highest priority (lowest number)
  // among ready processes, and use RR within the same priority level.
  const procs = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  const ganttChart: GanttChartItem[] = [];
  const completed: Process[] = [];
  let currentTime = 0;

  // arrival-sorted list for adding to ready queues
  const arrivalSorted = [...procs].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let idx = 0;

  // ready queues keyed by priority value (lower number = higher priority)
  const readyQueues = new Map<number, typeof procs>();

  const addArrived = (time: number) => {
    while (idx < arrivalSorted.length && arrivalSorted[idx].arrivalTime <= time) {
      const p = arrivalSorted[idx];
      const q = readyQueues.get(p.priority) || [];
      q.push(p);
      readyQueues.set(p.priority, q);
      idx++;
    }
  };

  while (completed.length < processes.length) {
    addArrived(currentTime);

    // find highest-priority queue with ready processes
    const availablePriorities = Array.from(readyQueues.keys()).sort((a, b) => a - b);
    let selectedPriority: number | undefined;
    for (const pr of availablePriorities) {
      const q = readyQueues.get(pr) || [];
      if (q.length > 0) {
        selectedPriority = pr;
        break;
      }
    }

    if (selectedPriority === undefined) {
      // nothing ready; jump to next arrival
      if (idx < arrivalSorted.length) {
        currentTime = Math.max(currentTime + 1, arrivalSorted[idx].arrivalTime);
        continue;
      }
      break;
    }

    const q = readyQueues.get(selectedPriority)!;
    const proc = q.shift()!;

    if (proc.startTime === undefined) {
      proc.startTime = currentTime;
      proc.responseTime = currentTime - proc.arrivalTime; // Time from arrival to first execution
    }

    const exec = Math.min(timeQuantum, proc.remainingTime!);

    const lastGantt = ganttChart[ganttChart.length - 1];
    if (lastGantt && lastGantt.pid === proc.pid && lastGantt.endTime === currentTime) {
      lastGantt.endTime = currentTime + exec;
    } else {
      ganttChart.push({ pid: proc.pid, startTime: currentTime, endTime: currentTime + exec, color: proc.color || '#3b82f6' });
    }

    proc.remainingTime! -= exec;
    currentTime += exec;

    // add any newly arrived processes at the new current time
    addArrived(currentTime);

    if (proc.remainingTime === 0) {
      proc.completionTime = currentTime;
      proc.turnaroundTime = proc.completionTime - proc.arrivalTime;
      proc.waitingTime = proc.turnaroundTime - proc.burstTime;
      completed.push(proc);
    } else {
      // enqueue back into same priority queue for fairness
      const backQ = readyQueues.get(proc.priority) || [];
      backQ.push(proc);
      readyQueues.set(proc.priority, backQ);
    }
  }

  return calculateMetrics(procs, ganttChart);
};
