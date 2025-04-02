import { useState, useEffect } from "react";
import NicheSelector from "@/components/NicheSelector";
import ApiKeyInput from "@/components/ApiKeyInput";
import PostGenerator from "@/components/PostGenerator";
import { LOCAL_STORAGE_NICHE_KEY } from "@/constants/niches";
import { getApiKey, isFreeTrialExhausted } from "@/services/postGeneratorService";
const TwitterPostGenerator = () => {
  const [hasSelectedNiche, setHasSelectedNiche] = useState(false);
  const [shouldShowApiKey, setShouldShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check if niche is already selected in localStorage
    const savedNiche = localStorage.getItem(LOCAL_STORAGE_NICHE_KEY);
    if (savedNiche) {
      setHasSelectedNiche(true);
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
  };
  const handleApiKeyInputComplete = () => {
    setShouldShowApiKey(false);
  };
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-12 h-12 bg-twitter-blue rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-xl font-bold">TW</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></span>
          </div>
          <div className="dark:text-white text-lg font-medium animate-pulse">Loading</div>
        </div>
      </div>;
  }

  // First show niche selector, then API key input (if needed), then the post generator
  return <div className="min-h-screen bg-gradient-to-br from-white to-gray-400 dark:from-gray-950 dark:to-gray-800 transition-colors duration-300">
      <div className="container max-w-4xl mx-auto py-6 md:px-0 px-0">
        {!hasSelectedNiche ? <div className="animate-fade-in">
            <NicheSelector onComplete={handleNicheSelectionComplete} />
          </div> : shouldShowApiKey ? <div className="animate-fade-in">
            <ApiKeyInput onComplete={handleApiKeyInputComplete} />
          </div> : <div className="animate-fade-in">
            <PostGenerator />
          </div>}
      </div>
    </div>;
};
export default TwitterPostGenerator;