
import { useState, useEffect } from "react";
import ApiKeyInput, { getRemainingFreeTrialPosts } from "./ApiKeyInput";

// This wrapper component safely handles the typed API key input
const SafeApiKeyInput = ({ onComplete }: { onComplete: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Just pre-load the remaining posts to ensure it's cached properly
        await getRemainingFreeTrialPosts();
      } catch (error) {
        console.error("Error initializing API key input:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-6 w-6 border-2 border-twitter-blue border-t-transparent rounded-full"></div>
    </div>;
  }

  return <ApiKeyInput onComplete={onComplete} />;
};

export default SafeApiKeyInput;
