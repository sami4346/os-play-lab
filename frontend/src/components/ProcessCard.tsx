import React from 'react';
import { Process } from '@/types/process';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Cpu, MemoryStick, Flag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProcessCardProps {
  process: Process;
  onDelete?: (pid: string) => void;
  compact?: boolean;
}

const ProcessCard = ({ process, onDelete, compact = false }: ProcessCardProps) => {
  const getStatusColor = (status: Process['status']) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'running':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: Process['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader 
        className="p-4 pb-2"
        style={{ 
          borderLeft: `4px solid ${process.color}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: process.color }}
              aria-label={`Process color: ${process.color}`}
            />
            <h3 className="font-bold text-lg">{process.pid}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(process.status)}>
              {getStatusLabel(process.status)}
            </Badge>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(process.pid)}
                className="h-8 w-8 p-0"
                aria-label={`Delete process ${process.pid}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {compact ? (
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              AT: {process.arrivalTime}
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              BT: {process.burstTime}
            </span>
            <span className="flex items-center gap-1">
              <Flag className="h-3 w-3" />
              P: {process.priority}
            </span>
            <span className="flex items-center gap-1">
              <MemoryStick className="h-3 w-3" />
              {process.memoryRequired}MB
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Arrival Time</span>
              </div>
              <p className="font-semibold">{process.arrivalTime} ms</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Cpu className="h-4 w-4" />
                <span>Burst Time</span>
              </div>
              <p className="font-semibold">{process.burstTime} ms</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Flag className="h-4 w-4" />
                <span>Priority</span>
              </div>
              <p className="font-semibold">{process.priority}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MemoryStick className="h-4 w-4" />
                <span>Memory</span>
              </div>
              <p className="font-semibold">{process.memoryRequired} MB</p>
            </div>

            {process.completionTime !== undefined && (
              <>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Completion</div>
                  <p className="font-semibold">{process.completionTime} ms</p>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Waiting</div>
                  <p className="font-semibold">{process.waitingTime ?? 0} ms</p>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessCard;
