
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getApiKey, setApiKey, clearApiKey } from "@/services/postGeneratorService";
import { KeyRound, Save, X, Info, ShieldCheck, ShieldAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const ApiKeyManager = () => {
  const [apiKey, setApiKeyState] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);
  const [hasKey, setHasKey] = useState<boolean>(false);
  
  useEffect(() => {
    const key = getApiKey();
    setHasKey(!!key);
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) return;
    
    setApiKey(apiKey.trim());
    setSaved(true);
    setHasKey(true);
    toast.success("API key saved successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemoveKey = () => {
    clearApiKey();
    setApiKeyState("");
    setHasKey(false);
    toast.info("API key removed");
  };

  return (
    <Card className="border overflow-hidden shadow-md mb-6 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className={`flex flex-row items-center justify-between ${hasKey ? 'bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800'}`}>
        <CardTitle className="text-lg flex items-center">
          {hasKey ? (
            <>
              <ShieldCheck className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-400">API Key Configured</span>
            </>
          ) : (
            <>
              <ShieldAlert className="mr-2 h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-800 dark:text-amber-400">API Key Required</span>
            </>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs dark:bg-gray-700 dark:text-white">
                <p>
                  Your API key is stored in your browser's local storage and is only used for making requests to the Gemini API. We never store or transmit this key to our servers.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center mb-2">
            <KeyRound className="mr-2 h-4 w-4 text-twitter-blue" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {hasKey ? "Update your API key below" : "Enter your Gemini API key to enable post generation"}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Input
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                className="font-mono text-sm flex-grow bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
                API_KEY
              </span>
            </div>
            <Button
              onClick={handleSaveKey}
              className="bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white shrink-0"
              disabled={!apiKey.trim() || saved}
            >
              {saved ? "Saved!" : "Save"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
            {hasKey && (
              <Button
                variant="outline"
                onClick={handleRemoveKey}
                className="border-red-300 hover:bg-red-50 text-red-500 dark:border-red-500/50 dark:hover:bg-red-900/20 dark:text-red-400 shrink-0"
                title="Remove API key"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className={`text-sm p-3 ${hasKey ? 'bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400'}`}>
        {hasKey ? (
          <span className="flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4" />
            API key is set and ready to use
          </span>
        ) : (
          <span className="flex items-center">
            <ShieldAlert className="mr-2 h-4 w-4" />
            Without an API key, you'll use the free trial (limited to 5 posts)
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApiKeyManager;
