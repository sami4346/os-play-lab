import { cn } from '@/lib/utils';

interface LoadingStateProps {
  type?: 'spinner' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export const LoadingState = ({
  type = 'spinner',
  size = 'md',
  fullScreen = false,
  text,
  className
}: LoadingStateProps) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const containerStyles = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center p-8';

  if (type === 'spinner') {
    return (
      <div className={cn(containerStyles, className)}>
        <div className={cn('relative', sizeMap[size])}>
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
        {text && (
          <p className="mt-4 text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={cn(containerStyles, className)}>
        <div className="flex gap-2">
          <div className={cn('bg-primary rounded-full animate-pulse', sizeMap[size])} style={{ animationDelay: '0ms' }}></div>
          <div className={cn('bg-primary rounded-full animate-pulse', sizeMap[size])} style={{ animationDelay: '150ms' }}></div>
          <div className={cn('bg-primary rounded-full animate-pulse', sizeMap[size])} style={{ animationDelay: '300ms' }}></div>
        </div>
        {text && (
          <p className="mt-4 text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  // skeleton type
  return (
    <div className={cn('space-y-4 animate-pulse', className)}>
      <div className="h-8 bg-muted rounded-lg w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-4/6"></div>
      </div>
    </div>
  );
};
