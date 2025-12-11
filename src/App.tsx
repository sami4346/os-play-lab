import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import { NavProvider, useNav } from "./context/NavContext";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const MainContent = () => {
  const { isSidebarOpen } = useNav();
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
  
  return (
    <main 
      className="min-h-screen transition-all duration-300 ease-in-out"
      style={{ marginLeft: getMarginLeft() }}
    >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chat" element={<ChatPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavProvider>
          <Navigation />
          <MainContent />
        </NavProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
