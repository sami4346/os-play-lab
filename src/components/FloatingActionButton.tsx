import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Play, Settings, HelpCircle, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onGenerateProcesses?: () => void;
  onRunSimulation?: () => void;
  onOpenSettings?: () => void;
  onShowHelp?: () => void;
  className?: string;
}

const FloatingActionButton = ({
  onGenerateProcesses,
  onRunSimulation,
  onOpenSettings,
  onShowHelp,
  className
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Plus,
      label: 'Generate Processes',
      onClick: onGenerateProcesses,
      color: 'bg-primary hover:bg-primary/90'
    },
    {
      icon: Play,
      label: 'Run Simulation',
      onClick: onRunSimulation,
      color: 'bg-success hover:bg-success/90'
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: onOpenSettings,
      color: 'bg-secondary hover:bg-secondary/90'
    },
    {
      icon: HelpCircle,
      label: 'Help',
      onClick: onShowHelp,
      color: 'bg-info hover:bg-info/90'
    }
  ];

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <TooltipProvider>
        {/* Action Items */}
        <div className="absolute bottom-16 right-0 space-y-2">
          {actions.map((action, index) => (
            <div
              key={action.label}
              className={cn(
                "flex items-center justify-end transition-all duration-300 ease-out",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              )}
              style={{ transitionDelay: isOpen ? `${index * 50}ms` : '0ms' }}
            >
              <span className="mr-3 text-sm font-medium text-foreground bg-background px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                {action.label}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className={cn("rounded-full shadow-lg interactive", action.color)}
                    onClick={action.onClick}
                    disabled={!action.onClick}
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>

        {/* Main FAB */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className="rounded-full shadow-xl bg-primary hover:bg-primary/90 interactive transition-all duration-300 ease-out"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Quick Actions"
            >
              <Plus className={cn("h-6 w-6 transition-transform duration-300", isOpen ? "rotate-45" : "")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Quick Actions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingActionButton;
