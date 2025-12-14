import { useEffect, useState } from 'react';
import { Process, GanttChartItem } from '@/types/process';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, FastForward, Rewind } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ProcessStateVisualizerProps {
  processes: Process[];
  ganttChart: GanttChartItem[];
  currentTime?: number;
  isSimulating?: boolean;
}

type ExtendedProcessStatus = 'new' | 'ready' | 'running' | 'waiting' | 'terminated';

interface ProcessState {
  pid: string;
  status: ExtendedProcessStatus;
  color: string;
  arrivalTime: number;
  completionTime?: number;
}

const ProcessStateVisualizer = ({ 
  processes, 
  ganttChart,
  currentTime = 0,
  isSimulating = false 
}: ProcessStateVisualizerProps) => {
  const [processStates, setProcessStates] = useState<ProcessState[]>([]);
  const [animationTime, setAnimationTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1); // 0.5x to 2x
  const [maxTime, setMaxTime] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  // Initialize process states
  useEffect(() => {
    if (processes.length === 0) {
      setProcessStates([]);
      setAnimationTime(0);
      setMaxTime(0);
      setShowAnimation(false);
      return;
    }

    // Calculate max time from gantt chart
    if (ganttChart.length > 0) {
      const max = Math.max(...ganttChart.map(g => g.endTime));
      setMaxTime(max);
    }

    // Initialize states
    const states: ProcessState[] = processes.map(proc => {
      let status: ExtendedProcessStatus = 'new';
      
      if (proc.status === 'completed') {
        status = 'terminated';
      } else if (proc.status === 'running') {
        status = 'running';
      } else if (proc.arrivalTime <= currentTime) {
        status = 'ready';
      }

      return {
        pid: proc.pid,
        status,
        color: proc.color || '#3b82f6',
        arrivalTime: proc.arrivalTime,
        completionTime: proc.completionTime
      };
    });

    setProcessStates(states);
  }, [processes, currentTime, ganttChart]);

  // Animation logic
  useEffect(() => {
    if (!isAnimating || ganttChart.length === 0 || maxTime === 0) {
      return;
    }

    // Base interval is 100ms, adjusted by speed (slower speeds = longer intervals)
    const baseInterval = 100;
    const interval = baseInterval / animationSpeed;
    
    // Calculate time step (how much simulation time passes per frame)
    // For slower animation, we want smaller time steps
    const totalFrames = (10000 / baseInterval) * animationSpeed; // 10 seconds total at 1x speed
    const timeStep = maxTime / totalFrames;

    const timer = setInterval(() => {
      setAnimationTime(prev => {
        const next = prev + timeStep;
        if (next >= maxTime) {
          setIsAnimating(false);
          return maxTime;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isAnimating, ganttChart, maxTime, animationSpeed]);

  // Update process states based on animation time
  useEffect(() => {
    if (animationTime > 0 && ganttChart.length > 0) {
      const states: ProcessState[] = processes.map(proc => {
        let status: ExtendedProcessStatus = 'new';
        
        // Check if process has arrived
        if (proc.arrivalTime <= animationTime) {
          status = 'ready';
          
          // Check if process is currently running
          const currentGantt = ganttChart.find(
            g => g.pid === proc.pid && 
                 g.startTime <= animationTime && 
                 g.endTime > animationTime
          );
          
          if (currentGantt) {
            status = 'running';
          }
          
          // Check if process is completed
          const lastGantt = ganttChart
            .filter(g => g.pid === proc.pid)
            .sort((a, b) => b.endTime - a.endTime)[0];
          
          if (lastGantt && lastGantt.endTime <= animationTime) {
            status = 'terminated';
          }
        }

        return {
          pid: proc.pid,
          status,
          color: proc.color || '#3b82f6',
          arrivalTime: proc.arrivalTime,
          completionTime: proc.completionTime
        };
      });

      setProcessStates(states);
    }
  }, [animationTime, ganttChart, processes]);

  const getStateConfig = (status: ExtendedProcessStatus) => {
    switch (status) {
      case 'new':
        return {
          label: 'New',
          color: 'bg-gray-400',
          description: 'Process created, not yet in memory',
          icon: '⭐'
        };
      case 'ready':
        return {
          label: 'Ready',
          color: 'bg-blue-500',
          description: 'In memory, waiting for CPU',
          icon: '⏳'
        };
      case 'running':
        return {
          label: 'Running',
          color: 'bg-green-500',
          description: 'Currently executing on CPU',
          icon: '⚡'
        };
      case 'waiting':
        return {
          label: 'Waiting',
          color: 'bg-yellow-500',
          description: 'Waiting for I/O or event',
          icon: '⏸️'
        };
      case 'terminated':
        return {
          label: 'Terminated',
          color: 'bg-red-500',
          description: 'Execution completed',
          icon: '✓'
        };
    }
  };

  const stateGroups = {
    new: processStates.filter(p => p.status === 'new'),
    ready: processStates.filter(p => p.status === 'ready'),
    running: processStates.filter(p => p.status === 'running'),
    waiting: processStates.filter(p => p.status === 'waiting'),
    terminated: processStates.filter(p => p.status === 'terminated')
  };

  const StateBox = ({ status, processes: procs }: { status: ExtendedProcessStatus; processes: ProcessState[] }) => {
    const config = getStateConfig(status);
    
    return (
      <div className="flex flex-col items-center space-y-2 p-4 bg-card border border-border rounded-lg min-h-[160px] transition-all hover:shadow-md">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-2xl">{config.icon}</span>
          <h3 className="font-semibold text-sm">{config.label}</h3>
        </div>
        
        <p className="text-xs text-muted-foreground text-center h-8">{config.description}</p>
        
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {procs.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">Empty</span>
          ) : (
            procs.map((proc) => (
              <div
                key={proc.pid}
                className="flex items-center space-x-1 px-2 py-1 rounded transition-all animate-in fade-in zoom-in duration-300"
                style={{ 
                  backgroundColor: proc.color,
                  opacity: 0.9
                }}
              >
                <span className="text-xs font-medium text-white">{proc.pid}</span>
              </div>
            ))
          )}
        </div>
        
        <Badge variant="secondary" className="mt-auto">
          {procs.length} {procs.length === 1 ? 'process' : 'processes'}
        </Badge>
      </div>
    );
  };

  const handlePlayPause = () => {
    if (animationTime >= maxTime) {
      // Reset and play from beginning
      setAnimationTime(0);
      setIsAnimating(true);
    } else {
      setIsAnimating(!isAnimating);
    }
  };

  const handleReset = () => {
    setAnimationTime(0);
    setIsAnimating(false);
  };

  const handleSpeedChange = (value: number[]) => {
    setAnimationSpeed(value[0]);
  };

  const handleShowAnimation = () => {
    setShowAnimation(true);
    setAnimationTime(0);
    setIsAnimating(true);
  };

  const progress = maxTime > 0 ? (animationTime / maxTime) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center justify-between">
              <span>Process State Diagram</span>
            </CardTitle>
            <CardDescription>
              Real-time visualization of process states during execution
            </CardDescription>
          </div>

          {/* Show Animation Button (when not shown yet) */}
          {!showAnimation && processes.length > 0 && ganttChart.length > 0 && (
            <Button 
              onClick={handleShowAnimation}
              className="gap-2"
              variant="default"
            >
              <Play className="h-4 w-4" />
              Show State Transitions
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {processes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Generate processes to see the state diagram</p>
          </div>
        ) : !showAnimation ? (
          <div className="text-center py-12 space-y-4">
            <div className="text-4xl mb-4">🎬</div>
            <p className="text-lg font-medium">Ready to visualize process states!</p>
            <p className="text-muted-foreground">
              Click "Show State Transitions" to see how processes move through different states
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Animation Controls */}
            {showAnimation && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handlePlayPause}
                      size="sm"
                      variant="outline"
                    >
                      {isAnimating ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : animationTime >= maxTime ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Replay
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleReset}
                      size="sm"
                      variant="outline"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 min-w-[200px]">
                    <Rewind className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <Slider
                        value={[animationSpeed]}
                        onValueChange={handleSpeedChange}
                        min={0.25}
                        max={2}
                        step={0.25}
                        className="w-full"
                      />
                    </div>
                    <FastForward className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium min-w-[40px]">{animationSpeed}x</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">Time: {animationTime.toFixed(1)} / {maxTime.toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* State Transition Flow Diagram */}
            <div className="relative">
              {/* Desktop Layout - Horizontal Flow */}
              <div className="hidden md:grid md:grid-cols-5 gap-4">
                <StateBox status="new" processes={stateGroups.new} />
                
                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <div className="text-2xl text-muted-foreground">→</div>
                </div>
                
                <StateBox status="ready" processes={stateGroups.ready} />
                
                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <div className="text-2xl text-muted-foreground">↔</div>
                </div>
                
                <StateBox status="running" processes={stateGroups.running} />
              </div>

              {/* Mobile Layout - Vertical Flow */}
              <div className="md:hidden space-y-4">
                <StateBox status="new" processes={stateGroups.new} />
                <div className="flex justify-center">
                  <div className="text-2xl text-muted-foreground">↓</div>
                </div>
                <StateBox status="ready" processes={stateGroups.ready} />
                <div className="flex justify-center">
                  <div className="text-2xl text-muted-foreground">↕</div>
                </div>
                <StateBox status="running" processes={stateGroups.running} />
              </div>
            </div>

            {/* Bottom Section - Waiting and Terminated */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <StateBox status="waiting" processes={stateGroups.waiting} />
              <StateBox status="terminated" processes={stateGroups.terminated} />
            </div>

            {/* State Transition Legend */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm mb-3">State Transitions:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>• <strong>New → Ready:</strong> Process arrives and is loaded into memory</div>
                <div>• <strong>Ready → Running:</strong> CPU scheduler selects process</div>
                <div>• <strong>Running → Ready:</strong> Time quantum expires (Round Robin)</div>
                <div>• <strong>Running → Waiting:</strong> Process waits for I/O (not shown in this simulation)</div>
                <div>• <strong>Waiting → Ready:</strong> I/O completes</div>
                <div>• <strong>Running → Terminated:</strong> Process completes execution</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessStateVisualizer;
