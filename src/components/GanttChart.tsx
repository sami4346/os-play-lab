import { GanttChartItem } from '@/types/process';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface GanttChartProps {
  ganttChart: GanttChartItem[];
}

const GanttChart = ({ ganttChart }: GanttChartProps) => {
  if (ganttChart.length === 0) {
    return (
      <Card className="p-5 sm:p-6 shadow-sm border-border">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <BarChart3 className="w-5 h-5 text-primary flex-shrink-0" />
          <h3 className="font-semibold text-foreground">Gantt Chart</h3>
        </div>
        <div className="text-center text-muted-foreground py-12 text-sm">
          <div className="text-2xl mb-2">📊</div>
          <p>Run a simulation to see the process execution timeline</p>
        </div>
      </Card>
    );
  }

  const maxTime = Math.max(...ganttChart.map(item => item.endTime));

  return (
    <Card className="p-5 sm:p-6 shadow-sm border-border overflow-hidden">
      <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
        <BarChart3 className="w-5 h-5 text-primary flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-foreground">Gantt Chart</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Process execution timeline</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Timeline Container */}
        <div className="relative">
          {/* Gantt Bar */}
          <div className="relative w-full bg-muted/30 rounded-lg p-4 border border-border min-h-24 flex items-center">
            {ganttChart.map((item, index) => {
              const widthPercent = ((item.endTime - item.startTime) / maxTime) * 100;
              const leftPercent = (item.startTime / maxTime) * 100;

              return (
                <div
                  key={`${item.pid}-${index}`}
                  className="absolute h-12 sm:h-14 transition-all duration-500 animate-slide-in group cursor-pointer hover:shadow-lg hover:scale-105"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    backgroundColor: item.color,
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    minWidth: '40px'
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                    <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md">
                      {item.pid}
                    </span>
                    <span className="text-xs text-white/90 drop-shadow-sm hidden sm:block">
                      {item.startTime}s-{item.endTime}s
                    </span>
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 dark:bg-gray-950 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                    <div className="font-semibold">{item.pid}</div>
                    <div className="text-gray-200">Duration: {item.endTime - item.startTime}s</div>
                    <div className="text-gray-300 text-xs">Time: {item.startTime}s → {item.endTime}s</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time axis */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              {Array.from({ length: Math.min(maxTime + 1, 11) }, (_, i) => 
                Math.floor((i * maxTime) / 10)
              ).map((time, i) => (
                <span key={i} className="text-xs">{time}s</span>
              ))}
            </div>
          </div>
        </div>

        {/* Process Legend */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Processes</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {ganttChart.reduce((acc, item) => {
              if (!acc.find(p => p.pid === item.pid)) {
                acc.push(item);
              }
              return acc;
            }, [] as typeof ganttChart).map((item) => (
              <div key={item.pid} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-md flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.pid}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GanttChart;
