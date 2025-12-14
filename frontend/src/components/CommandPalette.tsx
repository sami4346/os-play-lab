import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, Plus, RotateCcw, Settings, HelpCircle, 
  Shuffle, Save, FileText, Keyboard, Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  name: string;
  description?: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  category: 'actions' | 'navigation' | 'settings' | 'help';
}

interface CommandPaletteProps {
  commands: Command[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandPalette = ({ commands, open, onOpenChange }: CommandPaletteProps) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onOpenChange(false);
          setSearch('');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredCommands, selectedIndex, onOpenChange]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'actions': return 'Actions';
      case 'navigation': return 'Navigation';
      case 'settings': return 'Settings';
      case 'help': return 'Help & Resources';
      default: return category;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Search Input */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
        </div>

        {/* Commands List */}
        <ScrollArea className="max-h-[400px]">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No commands found</p>
              <p className="text-sm mt-2">Try searching for something else</p>
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category} className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {getCategoryLabel(category)}
                  </div>
                  <div className="space-y-1">
                    {cmds.map((cmd, idx) => {
                      const globalIndex = filteredCommands.indexOf(cmd);
                      const Icon = cmd.icon;
                      
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => {
                            cmd.action();
                            onOpenChange(false);
                            setSearch('');
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                            globalIndex === selectedIndex
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/50"
                          )}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{cmd.name}</div>
                            {cmd.description && (
                              <div className="text-xs text-muted-foreground truncate">
                                {cmd.description}
                              </div>
                            )}
                          </div>
                          {cmd.shortcut && (
                            <kbd className="hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded border bg-muted font-mono text-xs font-medium">
                              {cmd.shortcut.split('+').map((key, i) => (
                                <span key={i}>{key}</span>
                              ))}
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border p-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">↵</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
