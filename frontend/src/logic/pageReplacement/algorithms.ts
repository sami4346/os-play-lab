import { PageFrame, PageAccessResult, PageReplacementResult } from '@/types/pageReplacement';

/**
 * FIFO (First-In-First-Out) Page Replacement Algorithm
 * Replaces the oldest page in memory
 */
export const fifoPageReplacement = (
  referenceString: number[],
  numFrames: number
): PageReplacementResult => {
  const frames: PageFrame[] = Array(numFrames).fill(null).map(() => ({ pageNumber: null }));
  const accesses: PageAccessResult[] = [];
  let pageFaults = 0;
  let fifoQueue: number[] = []; // Track insertion order

  referenceString.forEach((page, index) => {
    // Check if page is already in memory
    const frameIndex = frames.findIndex(f => f.pageNumber === page);
    
    if (frameIndex !== -1) {
      // Page hit
      accesses.push({
        pageNumber: page,
        isPageFault: false,
        frameState: frames.map(f => ({ ...f })),
        accessTime: index,
      });
    } else {
      // Page fault
      pageFaults++;
      let victimFrameIndex = -1;
      let victimPage: number | undefined;

      // Find empty frame or use FIFO
      const emptyFrameIndex = frames.findIndex(f => f.pageNumber === null);
      
      if (emptyFrameIndex !== -1) {
        // Use empty frame
        victimFrameIndex = emptyFrameIndex;
        frames[emptyFrameIndex] = { pageNumber: page, loadTime: index };
        fifoQueue.push(page);
      } else {
        // Replace using FIFO (oldest page)
        const oldestPage = fifoQueue.shift()!;
        victimFrameIndex = frames.findIndex(f => f.pageNumber === oldestPage);
        victimPage = oldestPage;
        frames[victimFrameIndex] = { pageNumber: page, loadTime: index };
        fifoQueue.push(page);
      }

      accesses.push({
        pageNumber: page,
        isPageFault: true,
        frameState: frames.map(f => ({ ...f })),
        victimPage,
        victimFrameIndex,
        accessTime: index,
      });
    }
  });

  const pageHits = referenceString.length - pageFaults;

  return {
    algorithm: 'FIFO',
    referenceString,
    numFrames,
    accesses,
    pageFaults,
    pageHits,
    pageFaultRate: (pageFaults / referenceString.length) * 100,
    pageHitRate: (pageHits / referenceString.length) * 100,
    totalAccesses: referenceString.length,
  };
};

/**
 * LRU (Least Recently Used) Page Replacement Algorithm
 * Replaces the page that hasn't been used for the longest time
 */
export const lruPageReplacement = (
  referenceString: number[],
  numFrames: number
): PageReplacementResult => {
  const frames: PageFrame[] = Array(numFrames).fill(null).map(() => ({ 
    pageNumber: null,
    lastUsedTime: -1 
  }));
  const accesses: PageAccessResult[] = [];
  let pageFaults = 0;

  referenceString.forEach((page, index) => {
    const frameIndex = frames.findIndex(f => f.pageNumber === page);
    
    if (frameIndex !== -1) {
      // Page hit - update last used time
      frames[frameIndex].lastUsedTime = index;
      accesses.push({
        pageNumber: page,
        isPageFault: false,
        frameState: frames.map(f => ({ ...f })),
        accessTime: index,
      });
    } else {
      // Page fault
      pageFaults++;
      let victimFrameIndex = -1;
      let victimPage: number | undefined;

      const emptyFrameIndex = frames.findIndex(f => f.pageNumber === null);
      
      if (emptyFrameIndex !== -1) {
        // Use empty frame
        victimFrameIndex = emptyFrameIndex;
        frames[emptyFrameIndex] = { 
          pageNumber: page, 
          lastUsedTime: index,
          loadTime: index 
        };
      } else {
        // Replace LRU page (smallest lastUsedTime)
        victimFrameIndex = frames.reduce((lruIdx, frame, idx) => {
          return (frame.lastUsedTime ?? -1) < (frames[lruIdx].lastUsedTime ?? -1) ? idx : lruIdx;
        }, 0);
        
        victimPage = frames[victimFrameIndex].pageNumber!;
        frames[victimFrameIndex] = { 
          pageNumber: page, 
          lastUsedTime: index,
          loadTime: index 
        };
      }

      accesses.push({
        pageNumber: page,
        isPageFault: true,
        frameState: frames.map(f => ({ ...f })),
        victimPage,
        victimFrameIndex,
        accessTime: index,
      });
    }
  });

  const pageHits = referenceString.length - pageFaults;

  return {
    algorithm: 'LRU',
    referenceString,
    numFrames,
    accesses,
    pageFaults,
    pageHits,
    pageFaultRate: (pageFaults / referenceString.length) * 100,
    pageHitRate: (pageHits / referenceString.length) * 100,
    totalAccesses: referenceString.length,
  };
};

/**
 * Optimal Page Replacement Algorithm
 * Replaces the page that won't be used for the longest time in the future
 * (Theoretical best - requires future knowledge)
 */
export const optimalPageReplacement = (
  referenceString: number[],
  numFrames: number
): PageReplacementResult => {
  const frames: PageFrame[] = Array(numFrames).fill(null).map(() => ({ pageNumber: null }));
  const accesses: PageAccessResult[] = [];
  let pageFaults = 0;

  referenceString.forEach((page, index) => {
    const frameIndex = frames.findIndex(f => f.pageNumber === page);
    
    if (frameIndex !== -1) {
      // Page hit
      accesses.push({
        pageNumber: page,
        isPageFault: false,
        frameState: frames.map(f => ({ ...f })),
        accessTime: index,
      });
    } else {
      // Page fault
      pageFaults++;
      let victimFrameIndex = -1;
      let victimPage: number | undefined;

      const emptyFrameIndex = frames.findIndex(f => f.pageNumber === null);
      
      if (emptyFrameIndex !== -1) {
        // Use empty frame
        victimFrameIndex = emptyFrameIndex;
        frames[emptyFrameIndex] = { pageNumber: page, loadTime: index };
      } else {
        // Find the page that won't be used for the longest time
        let farthestUse = -1;
        victimFrameIndex = 0;

        frames.forEach((frame, idx) => {
          // Find next use of this page
          const nextUse = referenceString.slice(index + 1).indexOf(frame.pageNumber!);
          
          if (nextUse === -1) {
            // This page is never used again - perfect victim!
            victimFrameIndex = idx;
            farthestUse = Infinity;
          } else if (farthestUse !== Infinity && nextUse > farthestUse) {
            victimFrameIndex = idx;
            farthestUse = nextUse;
          }
        });

        victimPage = frames[victimFrameIndex].pageNumber!;
        frames[victimFrameIndex] = { pageNumber: page, loadTime: index };
      }

      accesses.push({
        pageNumber: page,
        isPageFault: true,
        frameState: frames.map(f => ({ ...f })),
        victimPage,
        victimFrameIndex,
        accessTime: index,
      });
    }
  });

  const pageHits = referenceString.length - pageFaults;

  return {
    algorithm: 'Optimal',
    referenceString,
    numFrames,
    accesses,
    pageFaults,
    pageHits,
    pageFaultRate: (pageFaults / referenceString.length) * 100,
    pageHitRate: (pageHits / referenceString.length) * 100,
    totalAccesses: referenceString.length,
  };
};

/**
 * Clock (Second Chance) Page Replacement Algorithm
 * Uses a circular list with reference bits
 */
export const clockPageReplacement = (
  referenceString: number[],
  numFrames: number
): PageReplacementResult => {
  const frames: PageFrame[] = Array(numFrames).fill(null).map(() => ({ 
    pageNumber: null,
    referenceBit: 0 
  }));
  const accesses: PageAccessResult[] = [];
  let pageFaults = 0;
  let clockHand = 0; // Points to next frame to consider for replacement

  referenceString.forEach((page, index) => {
    const frameIndex = frames.findIndex(f => f.pageNumber === page);
    
    if (frameIndex !== -1) {
      // Page hit - set reference bit
      frames[frameIndex].referenceBit = 1;
      accesses.push({
        pageNumber: page,
        isPageFault: false,
        frameState: frames.map(f => ({ ...f })),
        accessTime: index,
      });
    } else {
      // Page fault
      pageFaults++;
      let victimFrameIndex = -1;
      let victimPage: number | undefined;

      const emptyFrameIndex = frames.findIndex(f => f.pageNumber === null);
      
      if (emptyFrameIndex !== -1) {
        // Use empty frame
        victimFrameIndex = emptyFrameIndex;
        frames[emptyFrameIndex] = { 
          pageNumber: page, 
          referenceBit: 1,
          loadTime: index 
        };
        clockHand = (emptyFrameIndex + 1) % numFrames;
      } else {
        // Use clock algorithm to find victim
        while (true) {
          if (frames[clockHand].referenceBit === 0) {
            // Found victim - reference bit is 0
            victimFrameIndex = clockHand;
            victimPage = frames[clockHand].pageNumber!;
            frames[clockHand] = { 
              pageNumber: page, 
              referenceBit: 1,
              loadTime: index 
            };
            clockHand = (clockHand + 1) % numFrames;
            break;
          } else {
            // Give second chance - clear reference bit and move to next
            frames[clockHand].referenceBit = 0;
            clockHand = (clockHand + 1) % numFrames;
          }
        }
      }

      accesses.push({
        pageNumber: page,
        isPageFault: true,
        frameState: frames.map(f => ({ ...f })),
        victimPage,
        victimFrameIndex,
        accessTime: index,
      });
    }
  });

  const pageHits = referenceString.length - pageFaults;

  return {
    algorithm: 'Clock',
    referenceString,
    numFrames,
    accesses,
    pageFaults,
    pageHits,
    pageFaultRate: (pageFaults / referenceString.length) * 100,
    pageHitRate: (pageHits / referenceString.length) * 100,
    totalAccesses: referenceString.length,
  };
};

/**
 * Run all page replacement algorithms and compare results
 */
export const comparePageReplacementAlgorithms = (
  referenceString: number[],
  numFrames: number
) => {
  const results = [
    fifoPageReplacement(referenceString, numFrames),
    lruPageReplacement(referenceString, numFrames),
    optimalPageReplacement(referenceString, numFrames),
    clockPageReplacement(referenceString, numFrames),
  ];

  const bestAlgorithm = results.reduce((best, current) => 
    current.pageFaults < best.pageFaults ? current : best
  ).algorithm;

  const worstAlgorithm = results.reduce((worst, current) => 
    current.pageFaults > worst.pageFaults ? current : worst
  ).algorithm;

  return {
    results,
    bestAlgorithm,
    worstAlgorithm,
  };
};
