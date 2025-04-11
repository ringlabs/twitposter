
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
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  try {
    // Initialize theme (this will ensure theme is applied immediately)
    const { theme } = useTheme();
    const isMobile = useIsMobile();
    
    // Enhanced JSON-LD structured data for better SEO
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "TwitPoster",
      "headline": "TwitPoster - AI-Powered Twitter Content Creator",
      "description": "AI-powered Twitter post generator for creating engaging content that drives traffic and increases engagement",
      "applicationCategory": "SocialMediaApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "TwitPoster",
        "url": "https://twitposter.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://twitposter.app/logo512.png"
        }
      },
      "about": {
        "@type": "Thing",
        "name": "AI Twitter Content",
        "description": "AI-powered content generation for Twitter"
      },
      "keywords": "twitter posts, social media, content creation, AI writer, tweet generator, social media automation, twitter marketing",
      "inLanguage": "en-US",
      "datePublished": "2023-09-01",
      "dateModified": "2025-04-11",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://twitposter.app/"
      },
      "potentialAction": {
        "@type": "UseAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://twitposter.app/twitter_post_generator"
        },
        "actionStatus": "https://schema.org/PotentialActionStatus"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Social Media Manager"
        },
        "reviewBody": "TwitPoster has completely transformed how I create content for Twitter. The AI-generated posts consistently get high engagement."
      }
    };
    
    return (
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Helmet>
              <title>TwitPoster - AI Twitter Post Generator | Create Viral Content</title>
              <meta name="description" content="Generate high-engagement Twitter posts with TwitPoster AI. Our AI-powered tool creates niche-specific content that drives engagement, increases followers, and grows your audience." />
              <meta name="keywords" content="twitter posts, social media, content creation, AI writer, tweet generator, social media automation, twitter marketing, viral tweets, engagement posts, AI twitter tool, twitter content creator, X posts" />
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
          </AuthProvider>
        </QueryClientProvider>
      </React.StrictMode>
    );
  } catch (error) {
    // Fallback if there's an error initializing the theme
    console.error("Error in App:", error);
    return (
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
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
          </AuthProvider>
        </QueryClientProvider>
      </React.StrictMode>
    );
  }
};

export default App;
