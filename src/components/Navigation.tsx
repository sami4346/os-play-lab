import { Link, useLocation } from 'react-router-dom';
import { useNav } from '@/context/NavContext';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Navigation = () => {
  const { isSidebarOpen, toggleSidebar } = useNav();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'OS Learning Assistant', path: '/chat', icon: '💬' },
  ];

  return (
    <>
      {/* Mobile menu button - Top Right */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm shadow-lg"
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
                className="bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white"
              >
                {isSidebarOpen ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className={`p-4 border-b transition-all duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'
          }`}>
            <h1 className={`font-bold text-gray-800 transition-all duration-300 whitespace-nowrap ${
              isSidebarOpen ? 'text-xl' : 'text-center text-sm lg:text-xs'
            }`}>
              {isSidebarOpen ? 'OS Play Lab' : 'OS'}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
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
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                        location.pathname === item.path
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${!isSidebarOpen ? 'justify-center lg:px-2' : ''}`}
                    >
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <span className={`transition-all duration-300 whitespace-nowrap ${
                        isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:hidden'
                      }`}>
                        {item.name}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  {!isSidebarOpen && (
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t transition-all duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'
          }`}>
            <p className={`text-gray-500 transition-all duration-300 ${
              isSidebarOpen ? 'text-sm' : 'text-xs text-center'
            }`}>
              {isSidebarOpen ? 'OS Learning Assistant v1.0' : 'v1.0'}
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Navigation;
