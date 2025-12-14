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
    <Card className="p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-sm border-border bg-card flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-secondary flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Memory Visualization</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{TOTAL_MEMORY} MB Total</p>
          </div>
        </div>
        <Button 
          onClick={onCompact} 
          size="sm"
          variant="outline"
          className="gap-2 font-medium"
        >
          <Minimize2 className="w-4 h-4" />
          <span className="hidden sm:inline">Compact</span>
        </Button>
      </div>

      <div className="space-y-3 flex-1">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div>
            <p className="text-muted-foreground">Memory Status</p>
            <p className="text-xs text-muted-foreground mt-1">
              {memoryBlocks.filter(b => !b.pid).reduce((sum, b) => sum + b.size, 0)}MB free of {TOTAL_MEMORY}MB
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Fragmentation</p>
            <p className={`text-sm font-semibold mt-1 ${fragmentation > 40 ? 'text-destructive' : 'text-success'}`}>
              {fragmentation.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Memory Bar */}
        <div className="relative h-20 bg-muted rounded-lg overflow-hidden border-2 border-border">
          {memoryBlocks.map((block, index) => {
            const widthPercent = (block.size / TOTAL_MEMORY) * 100;
            const leftPercent = (block.start / TOTAL_MEMORY) * 100;

            return (
              <div
                key={block.id}
                className="absolute h-full transition-all duration-300 group cursor-pointer hover:brightness-110 flex items-center justify-center"
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  backgroundColor: block.pid ? block.color : '#f3f4f6',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
                title={
                  block.pid
                    ? `${block.pid}: ${block.size}MB (Addr: ${block.start}-${block.start + block.size})`
                    : `Free: ${block.size}MB`
                }
              >
                {widthPercent > 10 && (
                  <div className="text-center">
                    <span className="text-xs font-bold text-white drop-shadow-md">
                      {block.pid || 'Free'}
                    </span>
                    {widthPercent > 15 && (
                      <p className="text-xs text-white drop-shadow-md opacity-90">{block.size}MB</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Process Legend */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-foreground mb-2">Allocated</p>
          <div className="flex flex-wrap gap-2">
            {memoryBlocks.filter(b => b.pid).length > 0 ? (
              memoryBlocks.filter(b => b.pid).map((block) => (
                <div key={block.id} className="flex items-center gap-1.5 text-xs bg-muted/50 px-2 py-1.5 rounded">
                  <div 
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: block.color }}
                  />
                  <span className="font-semibold">{block.pid}</span>
                  <span className="text-muted-foreground">{block.size}MB</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">No processes allocated</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MemoryVisualizer;
