
import { useState, useEffect } from "react";
import NicheSelector from "@/components/NicheSelector";
import ApiKeyInput from "@/components/ApiKeyInput";
import PostGenerator from "@/components/PostGenerator";
import { getNichePreference, isFreeTrialExhausted, getApiKey } from "@/services/postGeneratorService";
import AuthScreen from "@/components/AuthScreen";
import { useAuth } from "@/context/AuthContext";

const TwitterPostGenerator = () => {
  const [hasSelectedNiche, setHasSelectedNiche] = useState(false);
  const [shouldShowApiKey, setShouldShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    // Only run this when auth loading is complete
    if (!loading) {
      const checkAppState = async () => {
        // Check if user is authenticated first
        if (!user) {
          setIsLoading(false);
          return; // Let's show AuthScreen
        }
        
        // Check if niche is already selected in Supabase or localStorage
        const savedNiche = await getNichePreference();
        if (savedNiche) {
          setHasSelectedNiche(true);
        }

        // Check if API key is already set or free trial is available
        const apiKey = await getApiKey();
        const freeTrialExhausted = await isFreeTrialExhausted();

        // Only show API key input if user doesn't have an API key AND free trial is exhausted
        setShouldShowApiKey(!apiKey && freeTrialExhausted);

        // Simulate loading for smoother transitions
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      };
      
      checkAppState();
    }
  }, [user, loading]);

  const handleAuthComplete = () => {
    // This is called after successful authentication
    // We'll reload the page to trigger the useEffect again
    window.location.reload();
  };

  const handleNicheSelectionComplete = () => {
    setHasSelectedNiche(true);
  };

  const handleApiKeyInputComplete = () => {
    setShouldShowApiKey(false);
  };

  if (loading || isLoading) {
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

  // First show auth screen, then niche selector, then API key input (if needed), then the post generator
  return <div className="min-h-screen bg-gradient-to-br from-gray-300 to-gray-600 dark:from-gray-950 dark:to-gray-800 transition-colors duration-300">
      <div className="container max-w-4xl mx-auto p-0 py-0 px-0">
        {!user ? <div className="animate-fade-in">
            <AuthScreen onComplete={handleAuthComplete} />
          </div> : !hasSelectedNiche ? <div className="animate-fade-in">
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
