
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clearApiKey, getApiKey, setApiKey, clearChatHistory, getFreeTrialUsage, supabase } from "@/services/postGeneratorService";
import GoogleApiKeyTutorial from "./GoogleApiKeyTutorial";
import { AlertTriangle, CheckCircle, Key, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const ApiKeyManager = () => {
  const [apiKey, setApiKeyState] = useState("");
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [isInIframe, setIsInIframe] = useState(false);
  const [tutorialExpanded, setTutorialExpanded] = useState(false);
  const [freeTrialRemaining, setFreeTrialRemaining] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  
  const { signOut } = useAuth();

  useEffect(() => {
    // Check if page is in an iframe or being rendered by puppeteer
    try {
      const isIframe = window.self !== window.top;
      const isPuppeteer = navigator.userAgent.includes('puppeteer');
      setIsInIframe(isIframe || isPuppeteer);
    } catch (e) {
      setIsInIframe(true);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const key = await getApiKey();
        setSavedApiKey(key);
        
        const usage = await getFreeTrialUsage();
        setFreeTrialRemaining(10 - usage);
      } catch (error) {
        console.error("Error loading API key data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    try {
      await setApiKey(apiKey);
      setSavedApiKey(apiKey);
      setApiKeyState("");
      toast.success("API key saved successfully");
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
    }
  };

  const handleRemoveApiKey = async () => {
    try {
      await clearApiKey();
      setSavedApiKey(null);
      toast.success("API key removed");
    } catch (error) {
      console.error("Error removing API key:", error);
      toast.error("Failed to remove API key");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleClearAllData = async () => {
    try {
      // Clear API Key
      await clearApiKey();
      setSavedApiKey(null);
      
      // Clear chat history
      await clearChatHistory();
      
      toast.success("All app data cleared successfully");
      
      // Sign out
      await signOut();
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Error clearing data:", error);
      toast.error("Failed to clear data");
    }
  };

  const toggleTutorial = () => {
    setTutorialExpanded(prev => !prev);
  };

  if (isLoading) {
    return (
      <Card className="dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl dark:text-white flex items-center">
            <Key className="mr-2 h-5 w-5 text-twitter-blue" />
            API Key Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-twitter-blue border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl dark:text-white flex items-center">
          <Key className="mr-2 h-5 w-5 text-twitter-blue" />
          API Key Manager
        </CardTitle>
        <CardDescription className="dark:text-gray-400 text-sm">
          Connect your Gemini API key to generate more posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedApiKey ? (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
            <p className="text-green-700 dark:text-green-400 text-sm">
              Your API key is saved and active
            </p>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mr-2 mt-0.5" />
            <div>
              <p className="text-amber-700 dark:text-amber-400 text-sm">
                You're using the free trial. For unlimited posts, enter your Gemini API key.
              </p>
              {freeTrialRemaining > 0 && (
                <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                  <span className="font-medium">Remaining: </span>
                  {freeTrialRemaining} of 10 free trial posts
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              type="password"
              className="flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <Button 
              onClick={handleSaveApiKey} 
              variant="outline" 
              className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              Save
            </Button>
          </div>
          
          {savedApiKey && (
            <Button 
              variant="outline" 
              className="w-full text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30 dark:text-red-400"
              onClick={handleRemoveApiKey}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove API Key
            </Button>
          )}

          <Button 
            variant="outline" 
            className="w-full mt-4 border-gray-200 dark:border-gray-700 dark:text-gray-200"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>

          {/* Show the delete all data button if in iframe/puppeteer environment or in settings */}
          {isInIframe && (
            <Button 
              variant="destructive" 
              className="w-full mt-4"
              onClick={handleClearAllData}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All App Data
            </Button>
          )}
        </div>

        <GoogleApiKeyTutorial isExpanded={tutorialExpanded} onToggle={toggleTutorial} />
      </CardContent>
      <CardFooter className="pt-2 text-xs text-gray-500 dark:text-gray-400">
        Your API key is stored securely in your Supabase account.
      </CardFooter>
    </Card>
  );
};

export default ApiKeyManager;
