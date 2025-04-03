
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Image, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface TutorialStep {
  title: string;
  description: string;
  imageAlt: string;
}

const tutorialSteps: TutorialStep[] = [{
  title: "Create a Google Account",
  description: "If you don't have a Google account, create one. If you already have one, sign in to your account.",
  imageAlt: "Google account sign in page"
}, {
  title: "Navigate to Google AI Studio",
  description: "Go to ai.google.dev in your browser to access Google AI Studio.",
  imageAlt: "Google AI Studio homepage"
}, {
  title: "Get Started with Google AI Studio",
  description: "Click on 'Get Started' or sign in with your Google account.",
  imageAlt: "Google AI Studio get started page"
}, {
  title: "Navigate to API Keys",
  description: "In Google AI Studio, click on your profile icon in the top-right corner and select 'API keys' from the dropdown menu.",
  imageAlt: "Google AI Studio profile dropdown showing API keys option"
}, {
  title: "Create a New API Key",
  description: "Click on the 'Create API key' button to generate a new API key for your project.",
  imageAlt: "Google AI Studio create API key button"
}, {
  title: "Name Your API Key",
  description: "Enter a name for your API key to help you remember what project it's for (e.g., 'Twitter Post Generator').",
  imageAlt: "Google AI Studio name your API key form"
}, {
  title: "Copy Your API Key",
  description: "Your new API key will be displayed. Copy it immediately as you won't be able to see it again!",
  imageAlt: "Google AI Studio copy API key screen"
}, {
  title: "Paste API Key in the App",
  description: "Return to the Twitter Post Generator and paste your copied API key into the API key input field.",
  imageAlt: "Twitter Post Generator API key input field"
}];

export interface GoogleApiKeyTutorialProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const GoogleApiKeyTutorial = ({
  isExpanded,
  onToggle
}: GoogleApiKeyTutorialProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-4 border-t pt-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm ms:text-lg text-twitter-blue flex items-center font-medium">
          How to Get Your Gemini API Key
        </h3>
        <Button variant="ghost" size="sm" className="text-twitter-blue hover:bg-twitter-blue/10" onClick={onToggle}>
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Hide Steps
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Steps
            </>
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Follow these step-by-step instructions to obtain your API key from Google AI Studio
          </p>
          
          <div className="space-y-4 mb-4">
            {tutorialSteps.map((step, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <CardContent className="p-1">
                  <div className="flex flex-col gap-4">
                    <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 w-full min-h-80">
                      <Image className="w-10 h-10 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center px-4">
                        {step.imageAlt}
                      </p>
                    </div>
                    
                    <div className="w-full flex flex-col px-2 pb-2">
                      <div className="mb-2 flex items-center">
                        <span className="bg-twitter-blue text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                          {index + 1}
                        </span>
                        <h4 className="text-lg font-medium">{step.title}</h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" className="text-twitter-blue border-twitter-blue hover:bg-twitter-blue/10" onClick={() => window.open("https://ai.google.dev/", "_blank")}>
              Visit Google AI Studio
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleApiKeyTutorial;
