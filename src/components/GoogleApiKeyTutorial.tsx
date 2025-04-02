
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Image, ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface TutorialStep {
  title: string;
  description: string;
  imageAlt: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Create a Google Account",
    description: "If you don't have a Google account, create one. If you already have one, sign in to your account.",
    imageAlt: "Google account sign in page"
  },
  {
    title: "Navigate to Google AI Studio",
    description: "Go to ai.google.dev in your browser to access Google AI Studio.",
    imageAlt: "Google AI Studio homepage"
  },
  {
    title: "Get Started with Google AI Studio",
    description: "Click on 'Get Started' or sign in with your Google account.",
    imageAlt: "Google AI Studio get started page"
  },
  {
    title: "Navigate to API Keys",
    description: "In Google AI Studio, click on your profile icon in the top-right corner and select 'API keys' from the dropdown menu.",
    imageAlt: "Google AI Studio profile dropdown showing API keys option"
  },
  {
    title: "Create a New API Key",
    description: "Click on the 'Create API key' button to generate a new API key for your project.",
    imageAlt: "Google AI Studio create API key button"
  },
  {
    title: "Name Your API Key",
    description: "Enter a name for your API key to help you remember what project it's for (e.g., 'Twitter Post Generator').",
    imageAlt: "Google AI Studio name your API key form"
  },
  {
    title: "Copy Your API Key",
    description: "Your new API key will be displayed. Copy it immediately as you won't be able to see it again!",
    imageAlt: "Google AI Studio copy API key screen"
  },
  {
    title: "Paste API Key in the App",
    description: "Return to the Twitter Post Generator and paste your copied API key into the API key input field.",
    imageAlt: "Twitter Post Generator API key input field"
  }
];

interface GoogleApiKeyTutorialProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GoogleApiKeyTutorial = ({ open, onOpenChange }: GoogleApiKeyTutorialProps) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const isMobile = useIsMobile();
  
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "w-full max-w-[90vw] md:max-w-[800px] p-0 h-[85vh] md:h-auto flex flex-col",
        "overflow-hidden"
      )}>
        <DialogHeader className="p-4 md:p-6 border-b">
          <DialogTitle className="text-xl md:text-2xl flex items-center text-twitter-blue">
            How to Get Your Gemini API Key
          </DialogTitle>
          <DialogDescription>
            Follow these step-by-step instructions to obtain your API key from Google AI Studio
          </DialogDescription>
        </DialogHeader>

        {/* Desktop version - Carousel */}
        <div className="hidden md:block flex-grow overflow-hidden">
          <Carousel orientation="horizontal" className="w-full">
            <CarouselContent>
              {tutorialSteps.map((step, index) => (
                <CarouselItem key={index}>
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Step {index + 1}: {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                    <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 h-64 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <Image className="w-12 h-12 text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Image placeholder for: {step.imageAlt}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        {/* Mobile version - Step by step card */}
        <div className="md:hidden flex-grow overflow-auto p-4">
          <Card className="border shadow-sm">
            <CardContent className="p-4 pt-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <span className="bg-twitter-blue text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                    {currentStep + 1}
                  </span>
                  {tutorialSteps[currentStep].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {tutorialSteps[currentStep].description}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 h-48 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700">
                <Image className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center px-4">
                  {tutorialSteps[currentStep].imageAlt}
                </p>
              </div>
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                  className="text-twitter-blue border-twitter-blue hover:bg-twitter-blue/10"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  onClick={nextStep} 
                  disabled={currentStep === tutorialSteps.length - 1}
                  className="text-twitter-blue border-twitter-blue hover:bg-twitter-blue/10"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isMobile ? `Step ${currentStep + 1} of ${tutorialSteps.length}` : ""}
          </div>
          <Button 
            variant="outline" 
            className="ml-auto"
            onClick={() => window.open("https://ai.google.dev/", "_blank")}
          >
            Visit Google AI Studio
            <ExternalLink className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleApiKeyTutorial;
