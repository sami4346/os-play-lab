import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNav } from '@/context/NavContext';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronLeft, ChevronRight, Home, MessageSquare, BookOpen, Settings, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import { useEffect, useState } from 'react';

const Navigation = () => {
  const { isSidebarOpen, toggleSidebar } = useNav();
  const location = useLocation();
  const navigate = useNavigate();
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSidebar();
      }
      // Escape to close sidebar on mobile
      if (e.key === 'Escape' && isSidebarOpen && window.innerWidth < 1024) {
        toggleSidebar();
      }
      // Ctrl + H for Home
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        navigate('/');
      }
      // Ctrl + C for Chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        navigate('/chat');
      }
      // Ctrl + L for Learn
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        navigate('/learn');
      }
      // Ctrl + , for Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        navigate('/settings');
      }
      // F1 for Help
      if (e.key === 'F1') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
    };

    document.addEventListener('keydown', handleShortcuts);
    return () => document.removeEventListener('keydown', handleShortcuts);
  }, [isSidebarOpen, toggleSidebar, navigate]);

  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: Home,
      description: 'Go to OS Simulator dashboard',
      shortcut: 'Ctrl+H'
    },
    { 
      name: 'OS Learning Assistant', 
      path: '/chat', 
      icon: MessageSquare,
      description: 'Chat with AI assistant about OS concepts',
      shortcut: 'Ctrl+C'
    },
    { 
      name: 'Learn', 
      path: '/learn', 
      icon: BookOpen,
      description: 'Browse OS learning materials',
      shortcut: 'Ctrl+L'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: Settings,
      description: 'Application settings and preferences',
      shortcut: 'Ctrl+,'
    },
  ];

  return (
    <>
      {/* Skip Link */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Mobile menu button - Top Right */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="icon"
          className="bg-surface/80 backdrop-blur-sm shadow-lg border-border hover:bg-surface focus:ring-2 focus:ring-primary"
          aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isSidebarOpen}
          aria-controls="sidebar-navigation"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Desktop toggle button - Absolute positioned */}
      <div className="hidden lg:block fixed top-4 z-50 transition-all duration-300"
           style={{ left: isSidebarOpen ? '240px' : '16px' }}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleSidebar}
                variant="outline"
                size="icon"
                className="bg-surface/80 backdrop-blur-sm shadow-lg hover:bg-surface focus:ring-2 focus:ring-primary border-border"
                aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                aria-expanded={isSidebarOpen}
              >
                {isSidebarOpen ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isSidebarOpen ? 'Collapse sidebar (Ctrl+K)' : 'Expand sidebar (Ctrl+K)'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Sidebar */}
      <aside
        id="sidebar-navigation"
        className={`fixed inset-y-0 left-0 z-40 bg-surface shadow-lg transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'
        }`}
        aria-label="Main navigation"
        aria-hidden={!isSidebarOpen}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className={`p-4 border-b border-border transition-all duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'
          }`}>
            <h1 className={`font-bold text-foreground transition-all duration-300 whitespace-nowrap ${
              isSidebarOpen ? 'text-xl' : 'text-center text-sm lg:text-xs'
            }`}>
              {isSidebarOpen ? 'OS Play Lab' : 'OS'}
            </h1>
            {isSidebarOpen && (
              <p className="text-xs text-muted-foreground mt-1">
                Learning Platform v2.0
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav 
            className="flex-1 p-4 space-y-2"
            role="navigation"
            aria-label="Main menu"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <TooltipProvider key={item.path}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        onClick={() => {
                          // On mobile, close sidebar after navigation
                          if (window.innerWidth < 1024 && isSidebarOpen) {
                            toggleSidebar();
                          }
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-glow'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground'
                        } ${!isSidebarOpen ? 'justify-center lg:px-2' : ''} ${
                          isKeyboardUser ? 'focus:ring-2 focus:ring-primary focus:ring-offset-2' : ''
                        }`}
                        aria-label={item.name}
                        aria-current={isActive ? 'page' : undefined}
                        data-shortcut={item.shortcut}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className={`transition-all duration-300 whitespace-nowrap ${
                          isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:hidden'
                        }`}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs opacity-70">{item.shortcut}</span>
                          </div>
                        </span>
                      </Link>
                    </TooltipTrigger>
                    {!isSidebarOpen && (
                      <TooltipContent side="right" className="max-w-xs">
                        <div className="text-center">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs opacity-70">{item.description}</p>
                          <p className="text-xs text-primary mt-1">{item.shortcut}</p>
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t border-border transition-all duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'
          }`}>
            <p className={`text-muted-foreground transition-all duration-300 ${
              isSidebarOpen ? 'text-sm' : 'text-xs text-center'
            }`}>
              {isSidebarOpen ? 'OS Learning Assistant v2.0' : 'v2.0'}
            </p>
            {isSidebarOpen && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+K</kbd> to toggle sidebar
                </p>
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">F1</kbd> for shortcuts
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Close navigation menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleSidebar();
            }
          }}
        />
      )}
      
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal 
        open={showKeyboardShortcuts} 
        onOpenChange={setShowKeyboardShortcuts} 
      />
    </>
  );
};

export default Navigation;
