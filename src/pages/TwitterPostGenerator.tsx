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
    setIsLoading(false);
  }, []);
  const handleNicheSelectionComplete = () => {
    setHasSelectedNiche(true);
  };
  const handleApiKeyInputComplete = () => {
    setShouldShowApiKey(false);
  };
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-pulse dark:text-white">Loading...</div>
      </div>;
  }

  // First show niche selector, then API key input (if needed), then the post generator
  return <div className="min-h-screen bg-twitter-white dark:bg-gray-900 px-0 py-0">
      <div className="container max-w-4xl mx-auto py-[10px]">
        {!hasSelectedNiche ? <NicheSelector onComplete={handleNicheSelectionComplete} /> : shouldShowApiKey ? <ApiKeyInput onComplete={handleApiKeyInputComplete} /> : <PostGenerator />}
      </div>
    </div>;
};
export default TwitterPostGenerator;