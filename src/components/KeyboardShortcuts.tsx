import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Command, Square, Play, Plus, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Shortcut {
  keys: string[];
  action: string;
  description?: string;
  category: 'navigation' | 'simulation' | 'general';
}

const shortcuts: Shortcut[] = [
  // Navigation
  {
    keys: ['Ctrl', 'K'],
    action: 'Toggle Sidebar',
    description: 'Show or hide the navigation sidebar',
    category: 'navigation'
  },
  {
    keys: ['Ctrl', '/'],
    action: 'Focus Search',
    description: 'Quick search for processes or settings',
    category: 'navigation'
  },
  {
    keys: ['Alt', '←'],
    action: 'Go Back',
    description: 'Navigate to previous page',
    category: 'navigation'
  },
  {
    keys: ['Alt', '→'],
    action: 'Go Forward',
    description: 'Navigate to next page',
    category: 'navigation'
  },
  // Simulation
  {
    keys: ['Ctrl', 'G'],
    action: 'Generate Processes',
    description: 'Create new random processes',
    category: 'simulation'
  },
  {
    keys: ['Ctrl', 'R'],
    action: 'Run Simulation',
    description: 'Start the scheduling simulation',
    category: 'simulation'
  },
  {
    keys: ['Ctrl', 'Space'],
    action: 'Pause/Resume',
    description: 'Pause or resume the animation',
    category: 'simulation'
  },
  {
    keys: ['Ctrl', '.'],
    action: 'Reset',
    description: 'Reset the current simulation',
    category: 'simulation'
  },
  // General
  {
    keys: ['Ctrl', ','],
    action: 'Settings',
    description: 'Open application settings',
    category: 'general'
  },
  {
    keys: ['F1'],
    action: 'Help',
    description: 'Show help and documentation',
    category: 'general'
  },
  {
    keys: ['Esc'],
    action: 'Close Dialog',
    description: 'Close any open dialog or modal',
    category: 'general'
  },
  {
    keys: ['Ctrl', '?'],
    action: 'Keyboard Shortcuts',
    description: 'Show this keyboard shortcuts guide',
    category: 'general'
  }
];

const categories = {
  navigation: { title: 'Navigation', icon: Command },
  simulation: { title: 'Simulation', icon: Play },
  general: { title: 'General', icon: Settings }
};

const KeyCombo = ({ keys }: { keys: string[] }) => (
  <div className="flex items-center gap-1">
    {keys.map((key, index) => (
      <React.Fragment key={key}>
        {index > 0 && <span className="text-muted-foreground text-xs mx-1">+</span>}
        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
          {key}
        </kbd>
      </React.Fragment>
    ))}
  </div>
);

const ShortcutRow = ({ shortcut }: { shortcut: Shortcut }) => (
  <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
    <div className="flex-1">
      <div className="font-medium text-sm">{shortcut.action}</div>
      {shortcut.description && (
        <div className="text-xs text-muted-foreground mt-1">{shortcut.description}</div>
      )}
    </div>
    <KeyCombo keys={shortcut.keys} />
  </div>
);

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '?') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="interactive">
          <Keyboard className="h-4 w-4 mr-2" />
          Keyboard Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Quick keyboard shortcuts to navigate and control the OS simulator more efficiently.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {Object.entries(categories).map(([categoryKey, category]) => {
            const Icon = category.icon;
            const categoryShortcuts = shortcuts.filter(s => s.category === categoryKey);
            
            return (
              <div key={categoryKey} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {categoryShortcuts.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {categoryShortcuts.map((shortcut) => (
                    <ShortcutRow key={shortcut.action} shortcut={shortcut} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Pro Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+?</kbd> anytime to show this guide</li>
              <li>• Use <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Esc</kbd> to close dialogs and modals</li>
              <li>• Most shortcuts work with both <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl</kbd> (Windows/Linux) and <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Cmd</kbd> (Mac)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;
