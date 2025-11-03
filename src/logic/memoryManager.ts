import { Process, MemoryBlock } from '@/types/process';

export const TOTAL_MEMORY = 1000; // MB
export type { MemoryBlock };

export const initializeMemory = (): MemoryBlock[] => {
  return [{
    id: 'free-0',
    pid: null,
    start: 0,
    size: TOTAL_MEMORY
  }];
};

export const allocateMemoryManual = (
  blocks: MemoryBlock[],
  process: Process,
  startPosition: number
): MemoryBlock[] | null => {
  const newBlocks = [...blocks];
  
  // Find free block at position
  const blockIndex = newBlocks.findIndex(
    b => b.pid === null && b.start <= startPosition && 
    b.start + b.size >= startPosition + process.memoryRequired
  );

  if (blockIndex === -1) return null;

  const block = newBlocks[blockIndex];
  const offset = startPosition - block.start;

  const result: MemoryBlock[] = [];
  
  // Add free space before
  if (offset > 0) {
    result.push({
      id: `free-${Date.now()}-before`,
      pid: null,
      start: block.start,
      size: offset
    });
  }

  // Add allocated block
  result.push({
    id: `alloc-${process.pid}`,
    pid: process.pid,
    start: startPosition,
    size: process.memoryRequired,
    color: process.color
  });

  // Add free space after
  const remainingSize = block.size - offset - process.memoryRequired;
  if (remainingSize > 0) {
    result.push({
      id: `free-${Date.now()}-after`,
      pid: null,
      start: startPosition + process.memoryRequired,
      size: remainingSize
    });
  }

  newBlocks.splice(blockIndex, 1, ...result);
  return newBlocks;
};

// First Fit
export const firstFit = (blocks: MemoryBlock[], process: Process): MemoryBlock[] | null => {
  const freeBlock = blocks.find(b => b.pid === null && b.size >= process.memoryRequired);
  
  if (!freeBlock) return null;
  
  return allocateMemoryManual(blocks, process, freeBlock.start);
};

// Best Fit
export const bestFit = (blocks: MemoryBlock[], process: Process): MemoryBlock[] | null => {
  const freeBlocks = blocks.filter(b => b.pid === null && b.size >= process.memoryRequired);
  
  if (freeBlocks.length === 0) return null;
  
  const bestBlock = freeBlocks.reduce((best, current) => 
    current.size < best.size ? current : best
  );
  
  return allocateMemoryManual(blocks, process, bestBlock.start);
};

// Worst Fit
export const worstFit = (blocks: MemoryBlock[], process: Process): MemoryBlock[] | null => {
  const freeBlocks = blocks.filter(b => b.pid === null && b.size >= process.memoryRequired);
  
  if (freeBlocks.length === 0) return null;
  
  const worstBlock = freeBlocks.reduce((worst, current) => 
    current.size > worst.size ? current : worst
  );
  
  return allocateMemoryManual(blocks, process, worstBlock.start);
};

// Compact Memory - merge adjacent free blocks
export const compactMemory = (blocks: MemoryBlock[]): MemoryBlock[] => {
  const sorted = [...blocks].sort((a, b) => a.start - b.start);
  const compacted: MemoryBlock[] = [];

  sorted.forEach(block => {
    const last = compacted[compacted.length - 1];
    
    if (last && last.pid === null && block.pid === null) {
      // Merge with previous free block
      last.size += block.size;
    } else {
      compacted.push({ ...block });
    }
  });

  return compacted;
};

// Calculate fragmentation percentage
export const calculateFragmentation = (blocks: MemoryBlock[]): number => {
  const freeBlocks = blocks.filter(b => b.pid === null);
  const totalFreeSpace = freeBlocks.reduce((sum, b) => sum + b.size, 0);
  const largestFreeBlock = freeBlocks.reduce((max, b) => Math.max(max, b.size), 0);
  
  if (totalFreeSpace === 0) return 0;
  
  const fragmentation = ((totalFreeSpace - largestFreeBlock) / totalFreeSpace) * 100;
  return fragmentation;
};

// Deallocate process memory
export const deallocateMemory = (blocks: MemoryBlock[], pid: string): MemoryBlock[] => {
  const newBlocks = blocks.map(b => 
    b.pid === pid ? { ...b, pid: null, color: undefined } : b
  );
  return compactMemory(newBlocks);
};
