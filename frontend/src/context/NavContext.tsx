import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type NavContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
};

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider = ({ children }: { children: ReactNode }) => {
  // Check if user preference exists in localStorage, default to true on desktop
  const getInitialState = () => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Default: open on desktop (>= 1024px), closed on mobile
    return window.innerWidth >= 1024;
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialState);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarOpen', JSON.stringify(newState));
      return newState;
    });
  };

  const setSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open);
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // On mobile, close sidebar by default when resizing to mobile size
      if (window.innerWidth < 1024) {
        const saved = localStorage.getItem('sidebarOpen');
        if (saved === null) {
          setIsSidebarOpen(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <NavContext.Provider value={{ isSidebarOpen, toggleSidebar, setSidebarOpen }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  const context = useContext(NavContext);
  if (context === undefined) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
};
