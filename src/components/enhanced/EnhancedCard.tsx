import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  onClick?: () => void;
}

export const EnhancedCard = ({
  children,
  className,
  variant = 'default',
  hover = false,
  onClick
}: EnhancedCardProps) => {
  const baseStyles = 'rounded-xl border transition-all duration-300 ease-out';
  
  const variantStyles = {
    default: 'bg-card border-border shadow-md hover:shadow-lg',
    glass: 'bg-white/10 dark:bg-black/10 backdrop-blur-lg border-white/20 dark:border-white/10 shadow-xl',
    gradient: 'bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20 shadow-lg',
    elevated: 'bg-card border-border shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.1)]'
  };

  const hoverStyles = hover ? 'hover:-translate-y-1 hover:scale-[1.01] cursor-pointer' : '';

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverStyles,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
