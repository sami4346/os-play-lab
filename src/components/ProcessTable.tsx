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
    <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-gradient-primary flex items-center gap-2">
        <Cpu className="w-5 h-5 text-primary-foreground" />
        <h3 className="font-semibold text-primary-foreground">Process Queue</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">PID</TableHead>
              <TableHead className="font-semibold">Arrival</TableHead>
              <TableHead className="font-semibold">Burst</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Memory (MB)</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No processes yet. Generate or add processes to begin.
                </TableCell>
              </TableRow>
            ) : (
              processes.map((process) => (
                <TableRow key={process.pid} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: process.color }}
                      />
                      {process.pid}
                    </div>
                  </TableCell>
                  <TableCell>{process.arrivalTime}s</TableCell>
                  <TableCell>{process.burstTime}s</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      P{process.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{process.memoryRequired} MB</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(process.status)}
                      className={getStatusColor(process.status)}
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
