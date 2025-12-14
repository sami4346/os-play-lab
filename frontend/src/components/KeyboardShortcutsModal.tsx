import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Shortcut {
  keys: string[];
  description: string;
  category: 'Navigation' | 'Simulation' | 'UI';
}

const shortcuts: Shortcut[] = [
  // Navigation shortcuts
  {
    keys: ['Ctrl', 'H'],
    description: 'Go to Home/Dashboard',
    category: 'Navigation',
  },
  {
    keys: ['Ctrl', 'C'],
    description: 'Open Chat Assistant',
    category: 'Navigation',
  },
  {
    keys: ['Ctrl', 'L'],
    description: 'Open Learning Materials',
    category: 'Navigation',
  },
  {
    keys: ['Ctrl', ','],
    description: 'Open Settings',
    category: 'Navigation',
  },
  {
    keys: ['F1'],
    description: 'Show Help',
    category: 'Navigation',
  },
  // UI shortcuts
  {
    keys: ['Ctrl', 'K'],
    description: 'Toggle Sidebar Collapse',
    category: 'UI',
  },
  {
    keys: ['Esc'],
    description: 'Close Sidebar (Mobile)',
    category: 'UI',
  },
  {
    keys: ['Tab'],
    description: 'Navigate Between Controls',
    category: 'UI',
  },
  // Simulation shortcuts (for future implementation)
  {
    keys: ['Ctrl', 'Enter'],
    description: 'Start Simulation (Coming Soon)',
    category: 'Simulation',
  },
  {
    keys: ['Ctrl', 'R'],
    description: 'Reset Simulation (Coming Soon)',
    category: 'Simulation',
  },
];

const categoryColors: Record<string, string> = {
  Navigation: 'bg-primary/10 text-primary-foreground border-primary/30',
  Simulation: 'bg-success/10 text-success dark:text-success border-success/30',
  UI: 'bg-accent/10 text-accent-foreground border-accent/30',
};

const KeyboardShortcutsModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, Shortcut[]>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate faster and control the simulator
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={categoryColors[category]}
                >
                  {category}
                </Badge>
              </div>

              <div className="space-y-2 grid gap-4 md:grid-cols-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {shortcut.description}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-4">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center gap-1">
                          <kbd
                            className="px-2 py-1 text-xs font-semibold text-foreground bg-background border border-border rounded shadow-sm"
                            aria-label={key}
                          >
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>💡 Tip:</strong> Press <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs border">F1</kbd> anytime to open this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
