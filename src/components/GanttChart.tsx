import { GanttChartItem } from '@/types/process';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface GanttChartProps {
  ganttChart: GanttChartItem[];
}

const GanttChart = ({ ganttChart }: GanttChartProps) => {
  if (ganttChart.length === 0) {
    return (
      <Card className="p-6 shadow-elegant border-border">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Gantt Chart</h3>
        </div>
        <div className="text-center text-muted-foreground py-12">
          No simulation data yet. Start a simulation to see the Gantt chart.
        </div>
      </Card>
    );
  }

  const maxTime = Math.max(...ganttChart.map(item => item.endTime));

  return (
    <Card className="p-6 shadow-elegant border-border">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Gantt Chart - Process Execution Timeline</h3>
      </div>

      <div className="mt-6 space-y-2">
        <div className="relative">
          {/* Timeline */}
          <div className="flex border-b-2 border-border pb-2">
            <div className="relative w-full h-20">
              {ganttChart.map((item, index) => {
                const widthPercent = ((item.endTime - item.startTime) / maxTime) * 100;
                const leftPercent = (item.startTime / maxTime) * 100;

                return (
                  <div
                    key={`${item.pid}-${index}`}
                    className="absolute h-full transition-all duration-500 animate-slide-in group cursor-pointer hover:brightness-110"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      backgroundColor: item.color,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm font-bold text-white drop-shadow-md">
                        {item.pid}
                      </span>
                      <span className="text-xs text-white/90">
                        {item.startTime}-{item.endTime}s
                      </span>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      <div className="font-semibold">{item.pid}</div>
                      <div>Start: {item.startTime}s</div>
                      <div>End: {item.endTime}s</div>
                      <div>Duration: {item.endTime - item.startTime}s</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time markers */}
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            {Array.from({ length: Math.min(maxTime + 1, 11) }, (_, i) => 
              Math.floor((i * maxTime) / 10)
            ).map((time, i) => (
              <span key={i}>{time}s</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GanttChart;
