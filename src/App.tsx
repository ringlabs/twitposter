
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TwitterPostGenerator from "./pages/TwitterPostGenerator";
import { useTheme } from "./hooks/useTheme";
import { useIsMobile } from "./hooks/use-mobile";
import { X } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  try {
    // Initialize theme (this will ensure theme is applied immediately)
    const { theme } = useTheme();
    const isMobile = useIsMobile();
    
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-white to-twitter-extraLightGray dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/twitter_post_generator" element={<TwitterPostGenerator />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    // Fallback if there's an error initializing the theme
    console.error("Error in App:", error);
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-white">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/twitter_post_generator" element={<TwitterPostGenerator />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
};

export default App;
