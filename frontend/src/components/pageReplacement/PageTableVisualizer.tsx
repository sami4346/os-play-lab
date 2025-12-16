import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageReplacementResult } from '@/types/pageReplacement';
import { CheckCircle2, XCircle, MemoryStick } from 'lucide-react';

interface PageTableVisualizerProps {
  result: PageReplacementResult;
  currentStep: number;
  numFrames: number;
}

const PageTableVisualizer = ({ result, currentStep, numFrames }: PageTableVisualizerProps) => {
  const currentAccess = result.accesses[currentStep];
  
  // Generate colors for pages
  const pageColors: Record<number, string> = {};
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];
  
  result.referenceString.forEach((page) => {
    if (!pageColors[page]) {
      pageColors[page] = colors[Object.keys(pageColors).length % colors.length];
    }
  });

  return (
    <div className="space-y-4">
      {/* Reference String Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reference String Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {result.referenceString.map((page, index) => (
              <div
                key={index}
                className={`flex-shrink-0 relative ${
                  index === currentStep ? 'scale-110' : ''
                } transition-transform`}
              >
                <div
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white
                    ${pageColors[page]}
                    ${index === currentStep ? 'ring-4 ring-primary shadow-lg' : ''}
                    ${index < currentStep ? 'opacity-50' : ''}
                    ${index > currentStep ? 'opacity-30' : ''}
                  `}
                >
                  {page}
                </div>
                {index === currentStep && (
                  <div className="absolute -bottom-6 left-0 right-0 text-center">
                    <Badge variant="default" className="text-xs">
                      Current
                    </Badge>
                  </div>
                )}
                {index < currentStep && result.accesses[index] && (
                  <div className="absolute -top-2 -right-2">
                    {result.accesses[index].isPageFault ? (
                      <XCircle className="w-5 h-5 text-red-500 fill-red-100" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-100" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Page Hit</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span>Page Fault</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Frames */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MemoryStick className="w-5 h-5" />
            Page Frames (Memory)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentAccess.frameState.map((frame, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-muted-foreground">
                  Frame {index}
                </div>
                <div
                  className={`
                    flex-1 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-white text-2xl
                    ${frame.pageNumber !== null ? pageColors[frame.pageNumber] : 'bg-muted border-dashed border-muted-foreground/30'}
                    ${index === currentAccess.victimFrameIndex && currentAccess.isPageFault ? 'ring-4 ring-red-500 animate-pulse' : ''}
                    transition-all duration-300
                  `}
                >
                  {frame.pageNumber !== null ? (
                    <div className="flex items-center gap-3">
                      <span>Page {frame.pageNumber}</span>
                      {result.algorithm === 'LRU' && frame.lastUsedTime !== undefined && (
                        <Badge variant="secondary" className="text-xs">
                          Last used: {frame.lastUsedTime}
                        </Badge>
                      )}
                      {result.algorithm === 'Clock' && frame.referenceBit !== undefined && (
                        <Badge variant="secondary" className="text-xs">
                          Ref bit: {frame.referenceBit}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Empty</span>
                  )}
                </div>
                {index === currentAccess.victimFrameIndex && currentAccess.isPageFault && (
                  <Badge variant="destructive" className="animate-pulse">
                    Replaced
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Frame Statistics */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Occupied Frames</div>
              <div className="text-2xl font-bold">
                {currentAccess.frameState.filter(f => f.pageNumber !== null).length} / {numFrames}
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Page Faults So Far</div>
              <div className="text-2xl font-bold text-red-500">
                {result.accesses.slice(0, currentStep + 1).filter(a => a.isPageFault).length}
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Page Hits So Far</div>
              <div className="text-2xl font-bold text-green-500">
                {result.accesses.slice(0, currentStep + 1).filter(a => !a.isPageFault).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageTableVisualizer;
