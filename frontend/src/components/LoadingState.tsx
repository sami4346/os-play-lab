import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState = ({ 
  message = 'Loading...', 
  progress, 
  showProgress = false,
  size = 'md',
  className 
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      
      <div className="text-center space-y-2 max-w-md">
        <p className={cn("font-medium text-foreground", textSizeClasses[size])}>
          {message}
        </p>
        
        {showProgress && progress !== undefined && (
          <div className="w-full space-y-1">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton components for better loading states
export const ProcessTableSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="h-64 bg-muted animate-pulse rounded-lg" />
);

export const CardSkeleton = () => (
  <div className="h-32 bg-muted animate-pulse rounded-lg" />
);

export const MetricsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
    ))}
  </div>
);

export default LoadingState;
