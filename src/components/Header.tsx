
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ApiKeyManager from "./ApiKeyManager";
import NicheSelector from "./NicheSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface HeaderProps {
  onGeneratePost: (specifyTopic?: boolean) => void;
}

const Header = ({
  onGeneratePost
}: HeaderProps) => {
  const { theme } = useTheme();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleGeneratePostClick = () => {
    setPopoverOpen(false);
    onGeneratePost();
  };

  return <div className="w-full border-b border-twitter-extraLightGray dark:border-gray-800 pb-4 mb-6 py-[2px]">
      <div className="flex items-center justify-between">
        <div>
          {!isMobile && <h1 className="text-2xl font-bold text-twitter-black dark:text-white">twit-poster</h1>}
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0 sm:max-w-full dark:bg-gray-900 dark:border-gray-800">
              <SheetHeader className="p-6 border-b dark:border-gray-800 py-0">
                <SheetTitle className="text-xl dark:text-white">Settings</SheetTitle>
              </SheetHeader>
              <div className="p-6 py-0 px-0">
                <Tabs defaultValue="niche" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
                    <TabsTrigger value="niche" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300">
                      Niche
                    </TabsTrigger>
                    <TabsTrigger value="api-key" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300">
                      API Key
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="niche" className="mt-4">
                    <NicheSelector onComplete={() => setSheetOpen(false)} inSettings={true} />
                  </TabsContent>
                  <TabsContent value="api-key" className="mt-4">
                    <ApiKeyManager />
                  </TabsContent>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>
          
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button className="bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Make Post
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 dark:bg-gray-800 dark:border-gray-700" align="end">
              <div className="flex flex-col">
                <Button variant="ghost" className="justify-start rounded-none hover:bg-twitter-extraLightGray dark:hover:bg-gray-700 dark:text-white" onClick={handleGeneratePostClick}>
                  <span>Auto Generate</span>
                </Button>
                <Button variant="ghost" className="justify-start rounded-none hover:bg-twitter-extraLightGray dark:hover:bg-gray-700 dark:text-white" onClick={() => {
                setPopoverOpen(false);
                onGeneratePost(true);
              }}>
                  <span>Specify Topic</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>;
};

export default Header;
