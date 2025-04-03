
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
    
    // JSON-LD structured data for better SEO
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TwitWise",
      "description": "AI-powered Twitter post generator for creating engaging content",
      "applicationCategory": "SocialMediaApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "TwitWise",
        "url": "https://twitwise.app"
      }
    };
    
    return (
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify(jsonLd)}
            </script>
          </Helmet>
          <BrowserRouter>
            <TooltipProvider>
              <div className="min-h-screen bg-gradient-to-br from-white to-twitter-extraLightGray dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/twitter_post_generator" element={<TwitterPostGenerator />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </React.StrictMode>
    );
  } catch (error) {
    // Fallback if there's an error initializing the theme
    console.error("Error in App:", error);
    return (
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <TooltipProvider>
              <div className="min-h-screen bg-white">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/twitter_post_generator" element={<TwitterPostGenerator />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </div>
            </TooltipProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </React.StrictMode>
    );
  }
};

export default App;
