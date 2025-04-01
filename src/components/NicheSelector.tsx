
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NICHES, LOCAL_STORAGE_NICHE_KEY } from "@/constants/niches";
import { toast } from "sonner";

interface NicheSelectorProps {
  onComplete: () => void;
  inSettings?: boolean;
}

const NicheSelector = ({ onComplete, inSettings = false }: NicheSelectorProps) => {
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);

  useEffect(() => {
    // Load currently selected niche
    const savedNiche = localStorage.getItem(LOCAL_STORAGE_NICHE_KEY);
    if (savedNiche) {
      setSelectedNiche(savedNiche);
    }
  }, []);

  const handleNicheSelect = (nicheId: string) => {
    setSelectedNiche(nicheId);
  };

  const handleSubmit = () => {
    if (!selectedNiche) {
      toast.error("Please select a niche first");
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_NICHE_KEY, selectedNiche);
    toast.success("Niche preference saved!");
    onComplete();
    
    if (inSettings) {
      // Reload the page to apply the new niche
      window.location.reload();
    }
  };

  if (inSettings) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {NICHES.map((niche) => (
            <Button
              key={niche.id}
              variant={selectedNiche === niche.id ? "default" : "outline"}
              className={`h-auto py-2 px-2 flex flex-col items-center justify-center transition-all ${
                selectedNiche === niche.id 
                  ? "bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white" 
                  : "hover:border-twitter-blue hover:text-twitter-blue dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
              onClick={() => handleNicheSelect(niche.id)}
            >
              <span className="text-center text-sm">{niche.name}</span>
            </Button>
          ))}
        </div>
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white"
        >
          Save Niche
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <Card className="border-twitter-blue shadow-md dark:bg-gray-800 dark:border-twitter-blue/50">
        <CardHeader className="bg-twitter-blue text-white">
          <CardTitle className="text-2xl">Choose Your Content Niche</CardTitle>
          <CardDescription className="text-twitter-white">
            Select a niche to generate Twitter posts tailored to your interests
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 dark:bg-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {NICHES.map((niche) => (
              <Button
                key={niche.id}
                variant={selectedNiche === niche.id ? "default" : "outline"}
                className={`h-auto py-4 px-3 flex flex-col items-center justify-center transition-all ${
                  selectedNiche === niche.id 
                    ? "bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white" 
                    : "hover:border-twitter-blue hover:text-twitter-blue dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleNicheSelect(niche.id)}
              >
                <span className="text-center">{niche.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end bg-twitter-extraLightGray dark:bg-gray-800 dark:border-t dark:border-gray-700">
          <Button 
            onClick={handleSubmit} 
            size="lg"
            className="bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white"
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NicheSelector;
