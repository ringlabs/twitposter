
import { useState, useEffect } from "react";
import NicheSelector from "@/components/NicheSelector";
import ApiKeyInput from "@/components/ApiKeyInput";
import PostGenerator from "@/components/PostGenerator";
import { LOCAL_STORAGE_NICHE_KEY } from "@/constants/niches";
import { getApiKey, isFreeTrialExhausted } from "@/services/postGeneratorService";
import { Helmet } from "react-helmet-async";

const TwitterPostGenerator = () => {
  const [hasSelectedNiche, setHasSelectedNiche] = useState(false);
  const [shouldShowApiKey, setShouldShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);

  useEffect(() => {
    // Check if niche is already selected in localStorage
    const savedNiche = localStorage.getItem(LOCAL_STORAGE_NICHE_KEY);
    if (savedNiche) {
      setHasSelectedNiche(true);
      setSelectedNiche(savedNiche);
    }

    // Check if API key is already set or free trial is available
    const apiKey = getApiKey();
    const freeTrialExhausted = isFreeTrialExhausted();

    // Only show API key input if user doesn't have an API key AND free trial is exhausted
    setShouldShowApiKey(!apiKey && freeTrialExhausted);

    // Simulate loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleNicheSelectionComplete = () => {
    setHasSelectedNiche(true);
    // Update the selected niche for metadata
    const savedNiche = localStorage.getItem(LOCAL_STORAGE_NICHE_KEY);
    setSelectedNiche(savedNiche);
  };

  const handleApiKeyInputComplete = () => {
    setShouldShowApiKey(false);
  };

  // Enhanced SEO JSON-LD for Twitter Post Generator page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TwitPoster AI Twitter Post Generator",
    "applicationCategory": "SocialMediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": selectedNiche ? 
      `AI-powered Twitter post generator for ${selectedNiche} content. Create engaging tweets that drive traffic and increase followers.` : 
      "Generate high-engagement Twitter posts with our AI tool. Create content that drives engagement, increases followers, and grows your audience.",
    "screenshot": "https://twitposter.app/twitter-card.png",
    "featureList": "Generate AI tweets, Choose from multiple niches, Free trial available, One-click copy",
    "keywords": `twitter posts, social media, content creation, AI writer, tweet generator, twitter marketing, ${selectedNiche || "social media"} posts`,
    "datePublished": "2023-09-01",
    "dateModified": "2025-04-08",
    "sameAs": [
      "https://twitter.com/twitposter_ai",
      "https://facebook.com/twitposter"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const metaDescription = selectedNiche ?
    `Create engaging ${selectedNiche} tweets with TwitPoster AI. Our generator creates optimized Twitter content to increase engagement and grow your followers.` :
    "Generate high-engagement Twitter posts with TwitPoster AI. Our AI-powered tool creates niche-specific content that drives engagement, increases followers, and grows your audience.";

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>TwitPoster - AI Twitter Post Generator | Create Viral Content</title>
          <meta name="description" content={metaDescription} />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://twitposter.app/twitter_post_generator" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-12 h-12 bg-twitter-blue rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-xl font-bold">TW</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></span>
            </div>
            <div className="dark:text-white text-lg font-medium animate-pulse">Loading</div>
          </div>
        </div>
      </>
    );
  }

  // First show niche selector, then API key input (if needed), then the post generator
  return (
    <>
      <Helmet>
        <title>
          {selectedNiche
            ? `${selectedNiche} Twitter Post Generator | TwitPoster AI`
            : "Twitter Post Generator | Create Viral Content with AI"}
        </title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`twitter posts, ${selectedNiche || "social media"}, content creation, AI writer, tweet generator, twitter marketing, viral tweets`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://twitposter.app/twitter_post_generator" />
        <meta property="og:title" content={selectedNiche ? `${selectedNiche} Twitter Post Generator` : "Twitter Post Generator | Create Viral Content with AI"} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://twitposter.app/twitter_post_generator" />
        <meta property="og:image" content="https://twitposter.app/twitter-card.png" />
        <meta property="og:site_name" content="TwitPoster" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@twitposter_ai" />
        <meta name="twitter:title" content={selectedNiche ? `${selectedNiche} Twitter Post Generator` : "Twitter Post Generator | Create Viral Content with AI"} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="https://twitposter.app/twitter-card.png" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-300 to-gray-600 dark:from-gray-950 dark:to-gray-800 transition-colors duration-300">
        <div className="container max-w-4xl mx-auto p-0 py-0 px-0">
          {!hasSelectedNiche ? (
            <div className="animate-fade-in">
              <NicheSelector onComplete={handleNicheSelectionComplete} />
            </div>
          ) : shouldShowApiKey ? (
            <div className="animate-fade-in">
              <ApiKeyInput onComplete={handleApiKeyInputComplete} />
            </div>
          ) : (
            <div className="animate-fade-in">
              <PostGenerator />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TwitterPostGenerator;
