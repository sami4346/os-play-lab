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

// Internal helper: allocate into a free block at index (automatic allocation)
const allocateIntoBlock = (
  blocks: MemoryBlock[],
  process: Process,
  blockIndex: number,
  offset: number = 0
): MemoryBlock[] | null => {
  const newBlocks = [...blocks];
  const block = newBlocks[blockIndex];

  if (!block || block.pid !== null) return null;
  if (offset < 0 || offset + process.memoryRequired > block.size) return null;

  const result: MemoryBlock[] = [];

  // Free space before allocated area
  if (offset > 0) {
    result.push({
      id: `free-${Date.now()}-${Math.floor(Math.random() * 10000)}-b`,
      pid: null,
      start: block.start,
      size: offset
    });
  }

  // Allocated block
  result.push({
    id: `alloc-${process.pid}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    pid: process.pid,
    start: block.start + offset,
    size: process.memoryRequired,
    color: process.color
  });

  // Free space after allocated area
  const remainingSize = block.size - offset - process.memoryRequired;
  if (remainingSize > 0) {
    result.push({
      id: `free-${Date.now()}-${Math.floor(Math.random() * 10000)}-a`,
      pid: null,
      start: block.start + offset + process.memoryRequired,
      size: remainingSize
    });
  }

  newBlocks.splice(blockIndex, 1, ...result);
  return newBlocks;
};

// First Fit
export const firstFit = (blocks: MemoryBlock[], process: Process): MemoryBlock[] | null => {
  const blockIndex = blocks.findIndex(b => b.pid === null && b.size >= process.memoryRequired);
  if (blockIndex === -1) return null;
  return allocateIntoBlock(blocks, process, blockIndex, 0);
};

// Best Fit
export const bestFit = (blocks: MemoryBlock[], process: Process): MemoryBlock[] | null => {
  const freeBlocks = blocks
    .map((b, i) => ({ b, i }))
    .filter(x => x.b.pid === null && x.b.size >= process.memoryRequired);

  if (freeBlocks.length === 0) return null;

  const best = freeBlocks.reduce((best, current) => current.b.size < best.b.size ? current : best);
  return allocateIntoBlock(blocks, process, best.i, 0);
};

// Worst Fit
export const worstFit = (blocks: MemoryBlock[], process: Process): MemoryBlock[] | null => {
  const freeBlocks = blocks
    .map((b, i) => ({ b, i }))
    .filter(x => x.b.pid === null && x.b.size >= process.memoryRequired);

  if (freeBlocks.length === 0) return null;

  const worst = freeBlocks.reduce((worst, current) => current.b.size > worst.b.size ? current : worst);
  return allocateIntoBlock(blocks, process, worst.i, 0);
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
