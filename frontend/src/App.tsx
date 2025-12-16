import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import LearningPage from "./pages/LearningPage";
import SettingsPage from "./pages/SettingsPage";
import PageReplacementPage from "./pages/PageReplacementPage";
import NotFound from "./pages/NotFound";
import { NavProvider, useNav } from "./context/NavContext";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import FloatingActionButton from "@/components/FloatingActionButton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Screen reader announcement component
const ScreenReaderAnnouncements = () => {
  const [announcement, setAnnouncement] = useState('');
  
  useEffect(() => {
    const handleAnnouncement = (event: CustomEvent) => {
      setAnnouncement(event.detail.message);
      setTimeout(() => setAnnouncement(''), 1000);
    };

    window.addEventListener('screen-reader-announce', handleAnnouncement as EventListener);
    return () => window.removeEventListener('screen-reader-announce', handleAnnouncement as EventListener);
  }, []);

  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true" 
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

// Utility function for screen reader announcements
export const announceToScreenReader = (message: string) => {
  window.dispatchEvent(new CustomEvent('screen-reader-announce', { detail: { message } }));
};

const MainContent = () => {
  const { isSidebarOpen } = useNav();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate margin based on sidebar state and screen size
  const getMarginLeft = () => {
    if (!isDesktop) {
      return '0px'; // No margin on mobile
    }
    return isSidebarOpen ? '256px' : '64px'; // Full width or icon-only width on desktop
  };

  const handleGenerateProcesses = () => {
    announceToScreenReader('Generating new processes');
    const event = new CustomEvent('generate-processes');
    window.dispatchEvent(event);
  };

  const handleRunSimulation = () => {
    announceToScreenReader('Running simulation');
    const event = new CustomEvent('run-simulation');
    window.dispatchEvent(event);
  };

  const handleOpenSettings = () => {
    announceToScreenReader('Opening settings');
    navigate('/settings');
  };

  const handleShowHelp = () => {
    announceToScreenReader('Opening help');
    navigate('/learn');
  };
  
  return (
    <>
      <ScreenReaderAnnouncements />
      <main 
        id="main-content"
        role="main"
        aria-label="OS Simulator"
        className="min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: getMarginLeft() }}
      >
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/learn" element={<LearningPage />} />
            <Route path="/page-replacement" element={<PageReplacementPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      
      {/* Floating Action Button */}
      <FloatingActionButton
        onGenerateProcesses={handleGenerateProcesses}
        onRunSimulation={handleRunSimulation}
        onOpenSettings={handleOpenSettings}
        onShowHelp={handleShowHelp}
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <NavProvider>
          <Navigation />
          <MainContent />
        </NavProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
