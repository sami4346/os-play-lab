/**
 * OS Simulator - Mathematical Calculations Validation
 * 
 * This document describes all the metrics calculated in the OS Simulator
 * and provides validation examples to ensure correctness.
 */

/**
 * FORMULA DEFINITIONS
 * ==================
 */

/**
 * 1. WAITING TIME
 * Formula: Waiting Time = Turnaround Time - Burst Time
 * Definition: Time a process waits in ready queue before execution
 * 
 * Example:
 * - Process P1: Arrival=0, Burst=5, Completion=5
 * - Turnaround Time = Completion - Arrival = 5 - 0 = 5
 * - Waiting Time = Turnaround - Burst = 5 - 5 = 0
 */

/**
 * 2. TURNAROUND TIME
 * Formula: Turnaround Time = Completion Time - Arrival Time
 * Definition: Total time from process arrival to completion
 * 
 * Example:
 * - Process P1: Arrival=0, Burst=5, Completion=5
 * - Turnaround Time = 5 - 0 = 5
 */

/**
 * 3. RESPONSE TIME
 * Formula: Response Time = Start Time - Arrival Time
 * Definition: Time from process arrival to first CPU execution
 * Note: For non-preemptive algorithms, this equals waiting time of first execution
 * Note: For preemptive algorithms, may differ from waiting time
 * 
 * Example (Non-preemptive):
 * - Process P1: Arrival=0, Start=0
 * - Response Time = 0 - 0 = 0
 * 
 * Example (Preemptive, multiple context switches):
 * - Process P2: Arrival=5, Start=10
 * - Response Time = 10 - 5 = 5
 */

/**
 * 4. CPU UTILIZATION
 * Formula: CPU Utilization (%) = (Total Burst Time / Total Execution Time) * 100
 * Definition: Percentage of time CPU is actively executing processes
 * 
 * Example (FCFS):
 * - P1(Burst=3, Arrival=0), P2(Burst=2, Arrival=1), P3(Burst=1, Arrival=2)
 * - Timeline: P1(0-3), P2(3-5), P3(5-6)
 * - Total Burst = 3 + 2 + 1 = 6
 * - Total Time = 6 (execution ends at time 6)
 * - CPU Util = (6/6) * 100 = 100%
 * 
 * Example (with idle time):
 * - P1(Burst=2, Arrival=0), P2(Burst=2, Arrival=10)
 * - Timeline: P1(0-2), [idle 2-10], P2(10-12)
 * - Total Burst = 2 + 2 = 4
 * - Total Time = 12
 * - CPU Util = (4/12) * 100 = 33.33%
 */

/**
 * 5. THROUGHPUT
 * Formula: Throughput (%) = (Number of Processes / Total Execution Time) * 100
 * Definition: Rate at which processes are completed (processes per unit time)
 * 
 * Example:
 * - 4 processes completed in 20 time units
 * - Throughput = (4/20) * 100 = 20%
 */

/**
 * 6. AVERAGE WAITING TIME
 * Formula: Avg Waiting Time = Sum(Waiting Times) / Number of Processes
 * Definition: Mean waiting time across all processes
 * 
 * Example:
 * - P1: Waiting = 0
 * - P2: Waiting = 2
 * - P3: Waiting = 5
 * - Avg = (0 + 2 + 5) / 3 = 2.33
 */

/**
 * 7. AVERAGE TURNAROUND TIME
 * Formula: Avg Turnaround = Sum(Turnaround Times) / Number of Processes
 * Definition: Mean turnaround time across all processes
 * 
 * Example:
 * - P1: Turnaround = 3
 * - P2: Turnaround = 5
 * - P3: Turnaround = 6
 * - Avg = (3 + 5 + 6) / 3 = 4.67
 */

/**
 * 8. AVERAGE RESPONSE TIME
 * Formula: Avg Response = Sum(Response Times) / Number of Processes
 * Definition: Mean response time across all processes
 * 
 * Example:
 * - P1: Response = 0
 * - P2: Response = 3
 * - P3: Response = 5
 * - Avg = (0 + 3 + 5) / 3 = 2.67
 */

/**
 * 9. MEMORY UTILIZATION
 * Formula: Memory Util (%) = (Used Memory / Total Memory) * 100
 * Definition: Percentage of memory allocated to processes
 * 
 * Example:
 * - Total Memory = 1000 MB
 * - Allocated = 300 MB (P1) + 200 MB (P2) = 500 MB
 * - Memory Util = (500/1000) * 100 = 50%
 */

/**
 * 10. EXTERNAL FRAGMENTATION
 * Formula: External Frag (%) = ((Total Free - Largest Free) / Total Free) * 100
 * Definition: Percentage of free memory that is unusable due to fragmentation
 * 
 * Example:
 * - Total Free Memory = 500 MB
 * - Free Blocks: 100 MB, 50 MB, 50 MB, 50 MB
 * - Largest Free Block = 100 MB
 * - External Frag = ((500 - 100) / 500) * 100 = 80%
 * (80% of free memory is fragmented into small blocks)
 */

/**
 * 11. INTERNAL FRAGMENTATION
 * Formula: Internal Frag = Allocated Block Size - Actual Process Size
 * Definition: Wasted space within allocated blocks (typically 0 in our allocation)
 * Note: In our implementation, we allocate exact sizes, so internal fragmentation = 0
 */

/**
 * VALIDATION EXAMPLE: FCFS with 3 Processes
 * ==========================================
 */

const example1 = {
  title: 'FCFS Scheduling - Validation Example',
  processes: [
    { pid: 'P1', arrival: 0, burst: 8 },
    { pid: 'P2', arrival: 1, burst: 4 },
    { pid: 'P3', arrival: 2, burst: 2 }
  ],
  
  execution: `
Timeline:
Time 0-8:   P1 executes (P2, P3 waiting)
Time 8-12:  P2 executes (P3 waiting)
Time 12-14: P3 executes

Process Details:
┌─────┬─────────┬───────┬──────────┬────────────┬────────────┬───────────────┐
│ PID │ Arrival │ Burst │ Start    │ Completion │ Turnaround │ Waiting Time  │
├─────┼─────────┼───────┼──────────┼────────────┼────────────┼───────────────┤
│ P1  │ 0       │ 8     │ 0        │ 8          │ 8-0 = 8    │ 8-8 = 0       │
│ P2  │ 1       │ 4     │ 8        │ 12         │ 12-1 = 11  │ 11-4 = 7      │
│ P3  │ 2       │ 2     │ 12       │ 14         │ 14-2 = 12  │ 12-2 = 10     │
└─────┴─────────┴───────┴──────────┴────────────┴────────────┴───────────────┘

Calculations:
- Avg Waiting Time = (0 + 7 + 10) / 3 = 17/3 = 5.67
- Avg Turnaround Time = (8 + 11 + 12) / 3 = 31/3 = 10.33
- Total Burst Time = 8 + 4 + 2 = 14
- Total Execution Time = 14 (starts at 0, ends at 14)
- CPU Utilization = (14/14) * 100 = 100%
- Throughput = (3/14) * 100 = 21.43%
- Avg Response Time = (0 + 7 + 10) / 3 = 5.67 (same as waiting for FCFS)
  `,
  
  expectedMetrics: {
    avgWaitingTime: 5.67,
    avgTurnaroundTime: 10.33,
    avgResponseTime: 5.67,
    cpuUtilization: 100,
    throughput: 21.43
  }
};

/**
 * VALIDATION EXAMPLE: SJF with 3 Processes
 * =========================================
 */

const example2 = {
  title: 'SJF Scheduling - Validation Example',
  processes: [
    { pid: 'P1', arrival: 0, burst: 8 },
    { pid: 'P2', arrival: 1, burst: 4 },
    { pid: 'P3', arrival: 2, burst: 2 }
  ],
  
  execution: `
Timeline:
Time 0-8:   P1 executes (shortest available = P1)
Time 8-10:  P3 executes (shortest of P2, P3 = P3 with burst 2)
Time 10-14: P2 executes (only P2 left)

Process Details:
┌─────┬─────────┬───────┬──────────┬────────────┬────────────┬───────────────┐
│ PID │ Arrival │ Burst │ Start    │ Completion │ Turnaround │ Waiting Time  │
├─────┼─────────┼───────┼──────────┼────────────┼────────────┼───────────────┤
│ P1  │ 0       │ 8     │ 0        │ 8          │ 8-0 = 8    │ 8-8 = 0       │
│ P3  │ 2       │ 2     │ 8        │ 10         │ 10-2 = 8   │ 8-2 = 6       │
│ P2  │ 1       │ 4     │ 10       │ 14         │ 14-1 = 13  │ 13-4 = 9      │
└─────┴─────────┴───────┴──────────┴────────────┴────────────┴───────────────┘

Calculations:
- Avg Waiting Time = (0 + 6 + 9) / 3 = 15/3 = 5.00
- Avg Turnaround Time = (8 + 8 + 13) / 3 = 29/3 = 9.67
- Total Burst Time = 8 + 2 + 4 = 14
- Total Execution Time = 14
- CPU Utilization = (14/14) * 100 = 100%
- Throughput = (3/14) * 100 = 21.43%
- Avg Response Time = (0 + 6 + 9) / 3 = 5.00
  `,
  
  expectedMetrics: {
    avgWaitingTime: 5.00,
    avgTurnaroundTime: 9.67,
    avgResponseTime: 5.00,
    cpuUtilization: 100,
    throughput: 21.43
  }
};

/**
 * VALIDATION EXAMPLE: Round Robin (TQ=2) with 3 Processes
 * =======================================================
 */

const example3 = {
  title: 'Round Robin (TQ=2) - Validation Example',
  processes: [
    { pid: 'P1', arrival: 0, burst: 5 },
    { pid: 'P2', arrival: 0, burst: 4 },
    { pid: 'P3', arrival: 0, burst: 3 }
  ],
  
  execution: `
Time Quantum = 2
Ready Queue (FIFO): [P1, P2, P3]

Timeline:
Time 0-2:   P1 executes (2 units, remaining: 3) → back to queue
Time 2-4:   P2 executes (2 units, remaining: 2) → back to queue
Time 4-6:   P3 executes (2 units, remaining: 1) → back to queue
Time 6-8:   P1 executes (2 units, remaining: 1) → back to queue
Time 8-9:   P2 executes (1 unit, remaining: 0) → COMPLETED
Time 9-10:  P3 executes (1 unit, remaining: 0) → COMPLETED
Time 10-11: P1 executes (1 unit, remaining: 0) → COMPLETED

Process Details:
┌─────┬─────────┬───────┬──────────┬────────────┬────────────┬───────────────┐
│ PID │ Arrival │ Burst │ Start    │ Completion │ Turnaround │ Waiting Time  │
├─────┼─────────┼───────┼──────────┼────────────┼────────────┼───────────────┤
│ P1  │ 0       │ 5     │ 0        │ 11         │ 11-0 = 11  │ 11-5 = 6      │
│ P2  │ 0       │ 4     │ 2        │ 9          │ 9-0 = 9    │ 9-4 = 5       │
│ P3  │ 0       │ 3     │ 4        │ 10         │ 10-0 = 10  │ 10-3 = 7      │
└─────┴─────────┴───────┴──────────┴────────────┴────────────┴───────────────┘

Calculations:
- Avg Waiting Time = (6 + 5 + 7) / 3 = 18/3 = 6.00
- Avg Turnaround Time = (11 + 9 + 10) / 3 = 30/3 = 10.00
- Total Burst Time = 5 + 4 + 3 = 12
- Total Execution Time = 11
- CPU Utilization = (12/11) * 100 = 109.09% → capped at 100% by context switching
- Throughput = (3/11) * 100 = 27.27%
- Avg Response Time = (0 + 2 + 4) / 3 = 2.00 (first start times)
  `,
  
  expectedMetrics: {
    avgWaitingTime: 6.00,
    avgTurnaroundTime: 10.00,
    avgResponseTime: 2.00,
    cpuUtilization: 109.09,
    throughput: 27.27
  }
};

/**
 * MEMORY ALLOCATION VALIDATION
 * =============================
 */

const memoryExample = {
  title: 'Memory Allocation - First Fit Validation',
  totalMemory: 1000,
  processes: [
    { pid: 'P1', memoryRequired: 200 },
    { pid: 'P2', memoryRequired: 150 },
    { pid: 'P3', memoryRequired: 100 }
  ],
  
  allocation: `
Initial State:
[Free: 0-1000 (1000)]

After P1 allocation (200 units):
[P1: 0-200 (200), Free: 200-1000 (800)]

After P2 allocation (150 units):
[P1: 0-200 (200), P2: 200-350 (150), Free: 350-1000 (650)]

After P3 allocation (100 units):
[P1: 0-200 (200), P2: 200-350 (150), P3: 350-450 (100), Free: 450-1000 (550)]

Memory Metrics:
- Used Memory = 200 + 150 + 100 = 450 MB
- Memory Utilization = (450/1000) * 100 = 45%
- Free Memory = 550 MB
- External Fragmentation = ((550 - 550) / 550) * 100 = 0% (single contiguous free block)
- Largest Free Block = 550 MB
  `,
  
  expectedMetrics: {
    memoryUtilization: 45,
    externalFragmentation: 0,
    largestFreeBlock: 550
  }
};

export const validationExamples = [example1, example2, example3, memoryExample];
