import React from 'react';
import { cn } from '@/lib/utils';

// Mobile-first responsive container
export const ResponsiveContainer = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={cn(
    "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    className
  )}>
    {children}
  </div>
);

// Responsive grid that adapts to screen size
export const ResponsiveGrid = ({ 
  children, 
  cols = 1, 
  gap = 4,
  className 
}: { 
  children: React.ReactNode; 
  cols?: 1 | 2 | 3 | 4;
  gap?: number;
  className?: string;
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={cn(
      `grid ${gridCols[cols]} gap-${gap}`,
      className
    )}>
      {children}
    </div>
  );
};

// Mobile-optimized card layout
export const MobileCard = ({ 
  children, 
  className,
  padding = 'p-4',
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
  padding?: string;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn(
      "bg-card border rounded-lg shadow-sm transition-all duration-200",
      "hover:shadow-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
      padding,
      "sm:p-6", // Larger padding on bigger screens
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Touch-friendly button wrapper
export const TouchTarget = ({ 
  children, 
  className,
  minSize = 'default',
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
  minSize?: 'small' | 'default' | 'large';
} & React.HTMLAttributes<HTMLDivElement>) => {
  const sizeClasses = {
    small: 'min-h-[36px] min-w-[36px]',
    default: 'min-h-[44px] min-w-[44px]',
    large: 'min-h-[48px] min-w-[48px]'
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center justify-center",
        sizeClasses[minSize],
        "touch-manipulation", // Improves touch responsiveness
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Responsive chart container
export const ResponsiveChart = ({ 
  children, 
  className,
  aspectRatio = 'auto',
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
  aspectRatio?: 'auto' | 'square' | 'video';
} & React.HTMLAttributes<HTMLDivElement>) => {
  const aspectClasses = {
    auto: '',
    square: 'aspect-square',
    video: 'aspect-video'
  };

  return (
    <div 
      className={cn(
        "w-full overflow-x-auto",
        "sm:overflow-x-visible", // Hide scroll on larger screens
        aspectClasses[aspectRatio],
        className
      )}
      {...props}
    >
      <div className="min-w-[300px] sm:min-w-0">
        {children}
      </div>
    </div>
  );
};

// Mobile-optimized table wrapper
export const MobileTableWrapper = ({ 
  children, 
  className,
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-4", className)} {...props}>
    {/* Desktop table */}
    <div className="hidden md:block overflow-x-auto">
      {children}
    </div>
    
    {/* Mobile card view - this would need to be implemented based on your table structure */}
    <div className="md:hidden space-y-3">
      {/* This is a placeholder - you'd need to transform your table rows into cards */}
      <div className="text-sm text-muted-foreground italic">
        Mobile card view would be rendered here
      </div>
    </div>
  </div>
);

// Responsive typography component
export const ResponsiveText = ({ 
  children, 
  as: Component = 'div',
  size = 'base',
  weight = 'normal',
  className,
  ...props 
}: { 
  children: React.ReactNode; 
  as?: keyof JSX.IntrinsicElements;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  [key: string]: any;
}) => {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <Component 
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        "leading-tight",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Mobile-safe spacing container
export const SafeAreaContainer = ({ 
  children, 
  className,
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn(
      "pb-safe-area", // iOS safe area
      "pt-safe-area", // Android status bar
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Hook for detecting mobile device
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};
