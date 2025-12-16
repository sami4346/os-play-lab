// Page Replacement Types

export interface PageFrame {
  pageNumber: number | null;
  lastUsedTime?: number;
  loadTime?: number;
  referenceBit?: number; // For Clock algorithm
}

export interface PageAccessResult {
  pageNumber: number;
  isPageFault: boolean;
  frameState: PageFrame[];
  victimPage?: number;
  victimFrameIndex?: number;
  accessTime: number;
}

export interface PageReplacementResult {
  algorithm: string;
  referenceString: number[];
  numFrames: number;
  accesses: PageAccessResult[];
  pageFaults: number;
  pageHits: number;
  pageFaultRate: number;
  pageHitRate: number;
  totalAccesses: number;
}

export interface PageReplacementComparison {
  results: PageReplacementResult[];
  bestAlgorithm: string;
  worstAlgorithm: string;
}

export type PageReplacementAlgorithm = 'FIFO' | 'LRU' | 'Optimal' | 'Clock';

export interface ReferencePattern {
  name: string;
  description: string;
  pattern: number[];
}
