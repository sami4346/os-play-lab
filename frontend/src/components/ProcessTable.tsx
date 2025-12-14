import { Process } from '@/types/process';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Cpu } from 'lucide-react';

interface ProcessTableProps {
  processes: Process[];
}

const ProcessTable = ({ processes }: ProcessTableProps) => {
  const getStatusVariant = (status: Process['status']) => {
    switch (status) {
      case 'running':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'waiting':
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: Process['status']) => {
    switch (status) {
      case 'running':
        return 'bg-warning text-warning-foreground';
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'waiting':
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden flex flex-col h-full">
      <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 flex items-center gap-3">
        <Cpu className="w-5 h-5 text-primary" />
        <div>
          <h3 className="font-semibold text-foreground">Process Queue</h3>
          <p className="text-xs text-muted-foreground">{processes.length} process{processes.length !== 1 ? 'es' : ''}</p>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-xs sm:text-sm">PID</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Arrival (s)</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Burst (s)</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Priority</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Memory (MB)</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl">📋</div>
                    <span>No processes yet</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              processes.map((process) => (
                <TableRow key={process.pid} className="hover:bg-muted/50 transition-colors border-b border-border/50">
                  <TableCell className="font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: process.color }}
                        title={process.pid}
                      />
                      <span className="truncate">{process.pid}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{process.arrivalTime}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{process.burstTime}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      P{process.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{process.memoryRequired}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(process.status)}
                      className={`${getStatusColor(process.status)} text-xs font-medium`}
                    >
                      {process.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProcessTable;
