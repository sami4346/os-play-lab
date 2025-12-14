import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Play, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EnhancedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning' | 'info';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  isComplete?: boolean;
  loadingText?: string;
  completeText?: string;
  icon?: React.ReactNode;
  showProgress?: boolean;
  progress?: number;
  successVariant?: 'check' | 'text' | 'both';
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      isLoading = false,
      isComplete = false,
      loadingText = 'Loading...',
      completeText = 'Complete!',
      icon,
      showProgress = false,
      progress = 0,
      successVariant = 'both',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const getVariant = () => {
      if (isComplete) return 'success';
      if (variant === 'success') return 'success';
      if (variant === 'warning') return 'warning';
      if (variant === 'info') return 'info';
      return variant;
    };

    const getButtonContent = () => {
      if (isLoading) {
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        );
      }

      if (isComplete) {
        switch (successVariant) {
          case 'check':
            return <CheckCircle className="h-4 w-4" />;
          case 'text':
            return completeText;
          case 'both':
          default:
            return (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {completeText}
              </>
            );
        }
      }

      if (icon && !isLoading && !isComplete) {
        return (
          <>
            {icon}
            {children && <span className="ml-2">{children}</span>}
          </>
        );
      }

      return children;
    };

    const getDisabledState = () => {
      return disabled || isLoading;
    };

    return (
      <div className="relative">
        {/* Progress bar overlay */}
        {showProgress && progress > 0 && progress < 100 && (
          <div className="absolute inset-0 overflow-hidden rounded-md">
            <div 
              className="h-full bg-primary/20 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <Button
          className={cn(
            'interactive transition-all duration-200 ease-in-out',
            isLoading && 'cursor-not-allowed opacity-80',
            isComplete && 'bg-success hover:bg-success/90',
            className
          )}
          variant={getVariant()}
          size={size}
          ref={ref}
          disabled={getDisabledState()}
          {...props}
        >
          {getButtonContent()}
        </Button>

        {/* Progress indicator */}
        {showProgress && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

// Pre-configured button variants for common actions
export const GenerateButton = (props: Omit<EnhancedButtonProps, 'icon'>) => (
  <EnhancedButton
    {...props}
    icon={<Plus className="h-4 w-4" />}
    loadingText="Generating..."
    completeText="Generated!"
  />
);

export const RunButton = (props: Omit<EnhancedButtonProps, 'icon'>) => (
  <EnhancedButton
    {...props}
    icon={<Play className="h-4 w-4" />}
    loadingText="Running..."
    completeText="Complete!"
    variant="success"
  />
);

export const ActionButton = (props: EnhancedButtonProps) => (
  <EnhancedButton
    {...props}
    loadingText="Processing..."
    completeText="Done!"
  />
);

export default EnhancedButton;
