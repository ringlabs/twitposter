
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TwitterPostGenerator from "./pages/TwitterPostGenerator";
import { useTheme } from "./hooks/useTheme";
import { useIsMobile } from "./hooks/use-mobile";

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
          <Sonner 
            position={isMobile ? "top-center" : "bottom-right"}
            theme={theme as "light" | "dark" | "system"}
            className="sonner-toast-modern"
            closeButton={!isMobile}
            toastOptions={{
              classNames: {
                toast: "group toast-modern rounded-lg border-border",
                title: "text-foreground text-base font-medium",
                description: "text-foreground text-sm dark:text-gray-300",
                actionButton: "bg-primary text-primary-foreground",
                cancelButton: "bg-muted text-muted-foreground",
                closeButton: "text-foreground dark:text-white",
                error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
                success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              }
            }}
          />
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
