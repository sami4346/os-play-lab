import React from 'react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2, AlertCircle, Info } from 'lucide-react';

interface ProgressToastOptions {
  title: string;
  description?: string;
  progress?: number;
  type?: 'loading' | 'success' | 'error' | 'info';
  duration?: number;
}

// Progress toast with visual feedback
export const showProgressToast = (options: ProgressToastOptions) => {
  const { title, description, progress = 0, type = 'loading', duration } = options;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'info':
        return <Info className="h-4 w-4 text-info" />;
      case 'loading':
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    }
  };

  return toast('', {
    duration: duration || (type === 'loading' ? Infinity : 4000),
    icon: getIcon(),
    description: (
      <div className="flex flex-col space-y-2">
        <div className="font-medium">{title}</div>
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
        {type === 'loading' && progress > 0 && (
          <div className="w-full space-y-1">
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground text-right">{progress}%</div>
          </div>
        )}
      </div>
    ),
  });
};

// Update existing progress toast
export const updateProgressToast = (toastId: string | number, progress: number, description?: string) => {
  toast('', {
    id: toastId,
    description: (
      <div className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground">{description}</div>
        <div className="w-full space-y-1">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground text-right">{progress}%</div>
        </div>
      </div>
    ),
  });
};

// Success toast
export const showSuccessToast = (title: string, description?: string) => {
  return showProgressToast({ title, description, type: 'success' });
};

// Error toast
export const showErrorToast = (title: string, description?: string) => {
  return showProgressToast({ title, description, type: 'error' });
};

// Info toast
export const showInfoToast = (title: string, description?: string) => {
  return showProgressToast({ title, description, type: 'info' });
};

// Loading toast that can be updated later
export const showLoadingToast = (title: string, description?: string) => {
  return showProgressToast({ title, description, type: 'loading' });
};
