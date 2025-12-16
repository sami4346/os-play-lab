import { ReferencePattern } from '@/types/pageReplacement';

/**
 * Generate a random reference string
 */
export const generateRandomReferenceString = (
  length: number,
  maxPageNumber: number
): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * maxPageNumber));
};

/**
 * Generate reference string with locality of reference
 * Simulates realistic program behavior where pages are often reused
 */
export const generateLocalityReferenceString = (
  length: number,
  maxPageNumber: number,
  localityWindow: number = 5
): number[] => {
  const result: number[] = [];
  let currentPage = Math.floor(Math.random() * maxPageNumber);

  for (let i = 0; i < length; i++) {
    result.push(currentPage);
    
    // 70% chance to stay in locality, 30% chance to jump
    if (Math.random() < 0.7) {
      // Stay in locality - choose nearby page
      const offset = Math.floor(Math.random() * localityWindow) - Math.floor(localityWindow / 2);
      currentPage = Math.max(0, Math.min(maxPageNumber - 1, currentPage + offset));
    } else {
      // Jump to random page
      currentPage = Math.floor(Math.random() * maxPageNumber);
    }
  }

  return result;
};

/**
 * Generate sequential reference string
 * Simulates sequential access pattern
 */
export const generateSequentialReferenceString = (
  length: number,
  maxPageNumber: number
): number[] => {
  const result: number[] = [];
  let currentPage = 0;

  for (let i = 0; i < length; i++) {
    result.push(currentPage);
    currentPage = (currentPage + 1) % maxPageNumber;
  }

  return result;
};

/**
 * Generate looping reference string
 * Simulates a loop accessing the same set of pages
 */
export const generateLoopingReferenceString = (
  length: number,
  loopSize: number
): number[] => {
  const loop = Array.from({ length: loopSize }, (_, i) => i);
  const result: number[] = [];

  for (let i = 0; i < length; i++) {
    result.push(loop[i % loopSize]);
  }

  return result;
};

/**
 * Predefined reference patterns for educational purposes
 */
export const referencePatterns: ReferencePattern[] = [
  {
    name: 'Random Access',
    description: 'Completely random page accesses - worst case for any algorithm',
    pattern: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1],
  },
  {
    name: 'Sequential Access',
    description: 'Pages accessed in order - like reading a file sequentially',
    pattern: [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3],
  },
  {
    name: 'Locality of Reference',
    description: 'Clustered accesses - realistic program behavior with working set',
    pattern: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5, 6, 7, 6, 7, 6, 7, 6, 7],
  },
  {
    name: 'Loop Pattern',
    description: 'Repeated loop through same pages - like a tight loop in code',
    pattern: [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
  },
  {
    name: 'FIFO Anomaly Demo',
    description: 'Demonstrates Belady\'s anomaly - more frames can cause more page faults with FIFO',
    pattern: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
  },
  {
    name: 'Working Set',
    description: 'Small working set that fits in memory, then shifts to new set',
    pattern: [1, 2, 3, 1, 2, 3, 1, 2, 3, 5, 6, 7, 5, 6, 7, 5, 6, 7, 1, 2],
  },
  {
    name: 'Thrashing Scenario',
    description: 'Working set larger than available frames - causes thrashing',
    pattern: [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4],
  },
];

/**
 * Parse a comma or space-separated string into a reference string
 */
export const parseReferenceString = (input: string): number[] | null => {
  try {
    const cleaned = input.trim().replace(/,/g, ' ');
    const numbers = cleaned.split(/\s+/).map(s => parseInt(s, 10));
    
    if (numbers.some(isNaN) || numbers.some(n => n < 0)) {
      return null;
    }
    
    return numbers;
  } catch {
    return null;
  }
};

/**
 * Validate reference string
 */
export const validateReferenceString = (referenceString: number[]): boolean => {
  return referenceString.length > 0 && 
         referenceString.every(page => page >= 0 && Number.isInteger(page));
};

/**
 * Calculate optimal number of frames for a reference string
 * Returns the minimum frames needed to avoid thrashing
 */
export const calculateOptimalFrames = (referenceString: number[]): number => {
  // Working set size - count unique pages in sliding window
  const windowSize = Math.min(10, referenceString.length);
  let maxUniquePages = 0;

  for (let i = 0; i <= referenceString.length - windowSize; i++) {
    const window = referenceString.slice(i, i + windowSize);
    const uniquePages = new Set(window).size;
    maxUniquePages = Math.max(maxUniquePages, uniquePages);
  }

  return Math.max(3, maxUniquePages);
};

/**
 * Get algorithm description
 */
export const getAlgorithmDescription = (algorithm: string): string => {
  const descriptions: Record<string, string> = {
    FIFO: 'Replaces the oldest page in memory (first loaded). Simple but may suffer from Belady\'s anomaly.',
    LRU: 'Replaces the page that hasn\'t been used for the longest time. Good performance but requires tracking.',
    Optimal: 'Replaces the page that won\'t be used for the longest time (requires future knowledge). Theoretical best.',
    Clock: 'Uses a circular buffer with reference bits. Approximates LRU with lower overhead.',
  };
  return descriptions[algorithm] || 'Unknown algorithm';
};

/**
 * Get educational insights based on results
 */
export const getPageReplacementInsights = (
  pageFaults: number,
  pageHits: number,
  algorithm: string,
  numFrames: number
): string[] => {
  const insights: string[] = [];
  const totalAccesses = pageFaults + pageHits;
  const faultRate = (pageFaults / totalAccesses) * 100;

  if (faultRate < 20) {
    insights.push(`✅ Excellent performance! Only ${faultRate.toFixed(1)}% page fault rate.`);
  } else if (faultRate < 40) {
    insights.push(`⚠️ Moderate performance. ${faultRate.toFixed(1)}% page fault rate could be improved.`);
  } else {
    insights.push(`❌ High page fault rate (${faultRate.toFixed(1)}%). Consider increasing frames or check for thrashing.`);
  }

  if (algorithm === 'FIFO' && numFrames >= 4) {
    insights.push(`ℹ️ FIFO can exhibit Belady's anomaly - sometimes more frames lead to MORE page faults!`);
  }

  if (algorithm === 'Optimal') {
    insights.push(`🎯 Optimal algorithm provides the theoretical minimum page faults (requires future knowledge).`);
  }

  if (algorithm === 'LRU') {
    insights.push(`🔄 LRU approximates Optimal in practice and doesn't suffer from Belady's anomaly.`);
  }

  if (algorithm === 'Clock') {
    insights.push(`⏰ Clock algorithm provides a good balance between performance and implementation overhead.`);
  }

  if (numFrames < 3) {
    insights.push(`⚠️ Very few frames (${numFrames}) - increasing frames would significantly reduce page faults.`);
  }

  return insights;
};
