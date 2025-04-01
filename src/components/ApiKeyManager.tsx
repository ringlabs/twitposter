
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getApiKey, setApiKey, clearApiKey } from "@/services/postGeneratorService";
import { KeyRound, Save, X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemoveKey = () => {
    clearApiKey();
    setApiKeyState("");
    setHasKey(false);
  };

  return (
    <Card className="border-twitter-blue/30 shadow-md mb-6 dark:bg-gray-800 dark:border-twitter-blue/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center dark:text-white">
          <KeyRound className="mr-2 h-5 w-5 text-twitter-blue" />
          Gemini API Key
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 h-4 w-4 text-twitter-darkGray dark:text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="dark:bg-gray-700 dark:text-white">
                <p className="max-w-xs">
                  Your API key is stored in your browser's local storage and is only used for making requests to the Gemini API. We never store or transmit this key to our servers.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            type="password"
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            className="flex-grow dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Button
            onClick={handleSaveKey}
            className="bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white"
            disabled={!apiKey.trim() || saved}
          >
            {saved ? "Saved!" : "Save"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
          {hasKey && (
            <Button
              variant="outline"
              onClick={handleRemoveKey}
              className="border-red-300 hover:bg-red-50 text-red-500 dark:border-red-500/50 dark:hover:bg-red-900/20 dark:text-red-400"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-twitter-extraLightGray text-sm text-twitter-darkGray dark:bg-gray-800 dark:text-gray-300">
        {hasKey ? (
          <span className="text-green-600 dark:text-green-400 flex items-center">
            <KeyRound className="mr-2 h-4 w-4" />
            API key is set and ready to use
          </span>
        ) : (
          <span>
            Enter your Gemini API key to generate posts. Without an API key, mock responses will be used.
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApiKeyManager;
