import { MemoryBlock } from '@/types/process';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Minimize2 } from 'lucide-react';
import { TOTAL_MEMORY } from '@/logic/memoryManager';

interface MemoryVisualizerProps {
  memoryBlocks: MemoryBlock[];
  onCompact: () => void;
  fragmentation: number;
}

const MemoryVisualizer = ({ memoryBlocks, onCompact, fragmentation }: MemoryVisualizerProps) => {
  return (
    <Card className="p-6 space-y-4 shadow-elegant border-border">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-lg">Memory Visualization</h3>
        </div>
        <Button 
          onClick={onCompact} 
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Minimize2 className="w-4 h-4" />
          Compact
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Memory: {TOTAL_MEMORY} MB</span>
          <span className="text-muted-foreground">
            Fragmentation: <span className={fragmentation > 40 ? 'text-destructive font-semibold' : 'text-success'}>
              {fragmentation.toFixed(1)}%
            </span>
          </span>
        </div>

        <div className="relative h-16 bg-muted rounded-lg overflow-hidden border-2 border-border">
          {memoryBlocks.map((block, index) => {
            const widthPercent = (block.size / TOTAL_MEMORY) * 100;
            const leftPercent = (block.start / TOTAL_MEMORY) * 100;

            return (
              <div
                key={block.id}
                className="absolute h-full transition-all duration-300 group cursor-pointer hover:brightness-110"
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  backgroundColor: block.pid ? block.color : '#e5e7eb',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
                title={
                  block.pid
                    ? `${block.pid}: ${block.size}MB (${block.start}-${block.start + block.size})`
                    : `Free: ${block.size}MB (${block.start}-${block.start + block.size})`
                }
              >
                {widthPercent > 8 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white drop-shadow-md">
                      {block.pid || 'Free'}
                    </span>
                  </div>
                )}
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {block.pid ? (
                    <>
                      <div className="font-semibold">{block.pid}</div>
                      <div>{block.size}MB ({block.start}-{block.start + block.size})</div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold">Free Space</div>
                      <div>{block.size}MB ({block.start}-{block.start + block.size})</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {memoryBlocks.filter(b => b.pid).map((block) => (
            <div key={block.id} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: block.color }}
              />
              <span className="font-medium">{block.pid}</span>
              <span className="text-muted-foreground">({block.size}MB)</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MemoryVisualizer;
