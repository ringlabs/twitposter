
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KeyRound, Save, ArrowRight } from "lucide-react";
import { getFreeTrialUsage, isFreeTrialExhausted, setApiKey } from "@/services/postGeneratorService";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onComplete: () => void;
}

const ApiKeyInput = ({ onComplete }: ApiKeyInputProps) => {
  const [apiKey, setApiKeyState] = useState<string>("");
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
      <Card className="border-twitter-blue shadow-md dark:bg-gray-800 dark:border-twitter-blue/50">
        <CardHeader className="bg-twitter-blue text-white">
          <CardTitle className="text-2xl">Set Up Your Gemini API Key</CardTitle>
          <CardDescription className="text-twitter-white">
            Enter your Gemini API key to generate personalized Twitter posts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 dark:bg-gray-800">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <KeyRound className="h-5 w-5 text-twitter-blue" />
              <span className="font-medium dark:text-white">Your API key is stored securely in your browser only</span>
            </div>
            <Input
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              className="border-twitter-lightGray focus:border-twitter-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {!freeTrialExhausted && (
              <div className="mt-2 text-sm text-twitter-darkGray dark:text-gray-300">
                <p>Don't have an API key? Try our free trial! You can make 5 posts without an API key.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-twitter-extraLightGray dark:bg-gray-800 dark:border-t dark:border-gray-700">
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
    </div>
  );
};

export default ApiKeyInput;
