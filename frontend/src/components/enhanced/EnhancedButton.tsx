import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'gradient' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading = false,
      icon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
      'transition-all duration-200 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'active:scale-95'
    );

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const variantStyles = {
      default: cn(
        'bg-primary text-primary-foreground shadow-md',
        'hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5',
        'focus-visible:ring-primary'
      ),
      gradient: cn(
        'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg',
        'hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5',
        'focus-visible:ring-purple-500'
      ),
      outline: cn(
        'border-2 border-primary bg-transparent text-primary',
        'hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5',
        'focus-visible:ring-primary'
      ),
      ghost: cn(
        'bg-transparent text-foreground hover:bg-accent',
        'focus-visible:ring-accent'
      ),
      success: cn(
        'bg-green-500 text-white shadow-md',
        'hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5',
        'focus-visible:ring-green-500'
      ),
      warning: cn(
        'bg-yellow-500 text-white shadow-md',
        'hover:bg-yellow-600 hover:shadow-lg hover:-translate-y-0.5',
        'focus-visible:ring-yellow-500'
      ),
      danger: cn(
        'bg-red-500 text-white shadow-md',
        'hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5',
        'focus-visible:ring-red-500'
      )
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          widthStyles,
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && icon && <span className="inline-flex">{icon}</span>}
        {children}
      </button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';
