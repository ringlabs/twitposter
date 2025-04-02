
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KeyRound, Save, ArrowRight, Lock, ShieldAlert, HelpCircle } from "lucide-react";
import { getFreeTrialUsage, isFreeTrialExhausted, setApiKey } from "@/services/postGeneratorService";
import { toast } from "sonner";
import GoogleApiKeyTutorial from "./GoogleApiKeyTutorial";

interface ApiKeyInputProps {
  onComplete: () => void;
}

const ApiKeyInput = ({ onComplete }: ApiKeyInputProps) => {
  const [apiKey, setApiKeyState] = useState<string>("");
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const freeTrialExhausted = isFreeTrialExhausted();
  const freeTrialRemaining = 5 - getFreeTrialUsage();

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    setApiKey(apiKey.trim());
    toast.success("API key saved successfully!");
    onComplete();
  };

  const handleSkip = () => {
    toast.success(`Starting free trial. You have ${freeTrialRemaining} posts remaining.`);
    onComplete();
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <Card className="border-twitter-blue shadow-md dark:bg-gray-800 dark:border-twitter-blue/50 overflow-hidden">
        <CardHeader className="bg-twitter-blue text-white">
          <CardTitle className="text-2xl flex items-center">
            <KeyRound className="mr-2 h-5 w-5" />
            Set Up Your Gemini API Key
          </CardTitle>
          <CardDescription className="text-twitter-white">
            Enter your Gemini API key to generate personalized Twitter posts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 dark:bg-gray-800">
          <div className="space-y-4">
            <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
              <Lock className="h-5 w-5 text-twitter-blue mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your API key is stored securely in your browser's local storage only
              </span>
            </div>
            
            <div className="relative">
              <Input
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                className="bg-white border-gray-300 focus:border-twitter-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10 font-mono text-sm"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
                API_KEY
              </span>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-twitter-blue/30 text-twitter-blue flex items-center justify-center hover:bg-twitter-blue/10"
              onClick={() => setShowTutorial(true)}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              How to get your Gemini API key
            </Button>
            
            {!freeTrialExhausted && (
              <div className="flex items-start p-3 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-medium">No API key? Try our free trial!</p>
                  <p className="mt-1">You can generate up to 5 posts without an API key.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 p-4">
          {!freeTrialExhausted && (
            <Button 
              onClick={handleSkip} 
              variant="outline"
              className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Skip for now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button 
            onClick={handleSubmit} 
            size="lg"
            className="bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white"
            disabled={!apiKey.trim()}
          >
            <Save className="mr-2 h-4 w-4" />
            Save API Key
          </Button>
        </CardFooter>
      </Card>
      
      <GoogleApiKeyTutorial open={showTutorial} onOpenChange={setShowTutorial} />
    </div>
  );
};

export default ApiKeyInput;
