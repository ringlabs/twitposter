
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {NICHES.map((niche) => (
            <Button
              key={niche.id}
              variant={selectedNiche === niche.id ? "default" : "outline"}
              className={`h-auto py-3 px-3 flex flex-col items-center justify-center transition-all ${
                selectedNiche === niche.id 
                  ? "bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white" 
                  : "hover:border-twitter-blue hover:text-twitter-blue dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
              onClick={() => handleNicheSelect(niche.id)}
            >
              <span className="text-center text-sm w-full whitespace-normal break-words">{niche.name}</span>
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
      <Card className="overflow-hidden border-twitter-blue/20 shadow-lg dark:bg-gray-800/90 dark:border-twitter-blue/30">
        <CardHeader className="bg-gradient-to-r from-twitter-blue to-twitter-darkBlue text-white py-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-twitter-blue text-2xl font-bold">TW</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center">Choose Your Content Niche</CardTitle>
          <CardDescription className="text-twitter-white text-center text-lg opacity-90 mt-2">
            Select a niche to generate Twitter posts tailored to your interests
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 dark:bg-gray-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {NICHES.map((niche) => (
              <Button
                key={niche.id}
                variant={selectedNiche === niche.id ? "default" : "outline"}
                className={`h-auto py-4 px-3 flex flex-col items-center justify-center transition-all min-h-[60px] ${
                  selectedNiche === niche.id 
                    ? "bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white shadow-md transform scale-105" 
                    : "hover:border-twitter-blue hover:text-twitter-blue dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleNicheSelect(niche.id)}
              >
                <span className="text-center w-full whitespace-normal break-words font-medium">{niche.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-6 bg-gray-50 dark:bg-gray-800/50 dark:border-t dark:border-gray-700">
          <Button 
            onClick={handleSubmit} 
            size="lg"
            className="w-full max-w-md bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white font-medium text-lg py-6"
            disabled={!selectedNiche}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NicheSelector;
